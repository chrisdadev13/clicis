import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { calUrlPattern } from "./create.schema";
import type { TRPCContext } from "../../trpc";
import type { TCreateSchema } from "./create.schema";
import validateCalUsername from "@/lib/validateCalUsername";
import { eventNames } from "process";
import axios from "axios";
import { env } from "@/env";

type CreateOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TCreateSchema;
};

interface SuccessResponse {
  result: {
    data: {
      json: Record<string, unknown> | null;
    };
  };
}

interface NotFoundResponse {
  message: string;
}

const eventTypeExists = async (
  username: string,
  eventTypeSlug: string,
  apiKey: string,
): Promise<SuccessResponse | NotFoundResponse | undefined> => {
  //const currentDate = new Date().toString();
  //const apiUrl = `https://api.cal.com/v1/slots?apiKey=${apiKey}&startTime=${currentDate}&endTime=${currentDate}&eventTypeSlug=${eventTypeSlug}&usernameList=[${username}]`;

  const apiUrl = `https://cal.com/api/trpc/public/event,event?batch=1&input={"0":{"json":{"username":"${username}","eventSlug":"${eventTypeSlug}","isTeamEvent":null,"org":"i","fromRedirectOfNonOrgLink":true},"meta":{"values":{"isTeamEvent":["undefined"]}}},"1":{"json":{"username":"${username}","eventSlug":"${eventTypeSlug}","isTeamEvent":false,"org":"i"}}}`;

  try {
    const response = await axios.get<SuccessResponse | NotFoundResponse>(
      apiUrl,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// identifier can be an url like: https://cal.com/username or https://cal.com/username/anything
// or just the cal.com username: username. if we receive a url with a path, we can extract
// the username from the path if we receive an username, we can construct the url from it
// (cal.com/username)
export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx.session;
  const { identifier, name, checkInFrequency, tags } = input;

  const tagsWithUserId = tags.map((tag) => ({
    userId: user.id,
    name: tag.name,
    color: tag.color,
  }));

  // if the identifier is a url, we can extract the username from the url
  // TODO: if not we assume it's an username and construct the url from it
  if (!calUrlPattern.test(identifier)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid URL format for cal.com",
    });
  }

  const { username, eventTypeSlug } = extractUsername(identifier);

  if (!username)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid URL format for cal.com",
    });

  if (!eventTypeSlug) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid URL format for cal.com you missed the event type",
    });
  }

  const eventExists = await eventTypeExists(
    username,
    eventTypeSlug,
    env.CAL_API_KEY,
  );

  if (!eventExists) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The event type doesn't exist on cal.com",
    });
  }

  if ((eventExists as NotFoundResponse).message) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The event type doesn't exist on cal.com",
    });
  }

  const contactAlreadyExists = await db.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (contactAlreadyExists)
    throw new TRPCError({
      code: "CONFLICT",
      message: "The contact already exists",
    });

  const calUsernameExists = await validateCalUsername(username);
  console.error(username);
  console.log(calUsernameExists);

  if (calUsernameExists?.available) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The username doesn't exist on cal.com",
    });
  }

  const newContact = await db.contacts.create({
    data: {
      userId: user.id,
      url: identifier,
      name,
      username,
      checkInFrequency,
      tags: {
        createMany: {
          data: tagsWithUserId,
        },
      },
    },
  });

  return newContact;
};

// cal.com/username | cal.com/username/anything
// https://cal.com/username | https://cal.com/username/anything
// http://cal.com/username | http://cal.com/username/anything
const extractUsername = (url: string) => {
  const match = url.match(calUrlPattern);

  if (match) {
    const username = match[1];
    const eventTypeSlug = match[2];

    return { username, eventTypeSlug };
  } else {
    return { username: null, eventTypeSlug: null };
  }
};

export default createHandler;
