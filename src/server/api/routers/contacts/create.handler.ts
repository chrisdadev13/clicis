import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { calUrlPattern } from "./create.schema";
import type { TRPCContext } from "../../trpc";
import type { TCreateSchema } from "./create.schema";
import validateCalUsername from "@/lib/validateCalUsername";
import axios from "axios";

type CreateOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TCreateSchema;
};

interface SuccessResponse {
  result: {
    data: {
      json: {
        id: number;
        title: string;
        slug: string;
        owner: {
          id: number;
        };
      } | null;
    };
  };
}

interface SuccessResponseNew {
  pageProps: {
    users: [
      {
        name: string;
        username: string;
        bio: string;
      },
    ];
    eventTypes: [
      {
        id: number;
        title: string;
        slug: string;
        length: number;
      },
    ];
  };
}

const eventTypeExists = async (
  username: string,
  //eventTypeSlug: string,
): Promise<SuccessResponseNew | { notFound: true } | undefined> => {
  //const currentDate = new Date().toString();
  //const apiUrl = `https://api.cal.com/v1/slots?apiKey=${apiKey}&startTime=${currentDate}&endTime=${currentDate}&eventTypeSlug=${eventTypeSlug}&usernameList=[${username}]`;

  //const apiUrl = `https://cal.com/api/trpc/public/event,event?batch=1&input={"0":{"json":{"username":"${username}","eventSlug":"${eventTypeSlug}","isTeamEvent":null,"org":"i","fromRedirectOfNonOrgLink":true},"meta":{"values":{"isTeamEvent":["undefined"]}}},"1":{"json":{"username":"${username}","eventSlug":"${eventTypeSlug}","isTeamEvent":false,"org":"i"}}}`;
  //const apiUrl = `https://cal.com/api/trpc/public/event?batch=1&input={"0":{"json":{"username":"${username}","eventSlug":"${eventTypeSlug}","isTeamEvent":false,"org":null}}}`;

  const apiUrl = `https://cal.com/_next/data/rvL6o_8tKUuD8OWntAbyy/en/org/cal/${username}.json?user=${username}&orgSlug=cal`;

  try {
    //const response = await axios.get<SuccessResponse[]>(apiUrl);
    const response = await axios.get<SuccessResponseNew | { notFound: true }>(
      apiUrl,
    );

    if (!response) return undefined;

    if (!response.data) return undefined;

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
  const { identifier, name, checkInFrequency, tag } = input;

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

  // if (!eventTypeSlug) {
  //   throw new TRPCError({
  //     code: "BAD_REQUEST",
  //     message: "Invalid URL format for cal.com you missed the event type",
  //   });
  // }

  const contactCalPage = await eventTypeExists(username);

  if (!contactCalPage) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The event type doesn't exist on cal.com",
    });
  }

  if ((contactCalPage as { notFound: boolean }).notFound) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The event type doesn't exist on cal.com",
    });
  }

  const contactAlreadyExists = await db.contacts.findFirst({
    where: {
      username,
      userId: user.id,
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

  if (username === user.username) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You can't add yourself as a contact",
    });
  }

  const calUsernameExists = await validateCalUsername(username);

  if (calUsernameExists?.available) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The username doesn't exist on cal.com",
    });
  }

  if (!(contactCalPage as SuccessResponseNew).pageProps.users) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This user doesn't exist on cal.com or he is not available",
    });
  }

  if (!(contactCalPage as SuccessResponseNew).pageProps.eventTypes) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This user is not available for check-ins",
    });
  }

  if (!(contactCalPage as SuccessResponseNew).pageProps.eventTypes.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This user is not available for check-ins",
    });
  }

  const eventsToCreate = (
    contactCalPage as SuccessResponseNew
  ).pageProps.eventTypes
    .slice(0, 3)
    .map((event) => ({
      calId: event.id,
      title: event.title,
      slug: event.slug,
      length: event.length,
    }));

  const newContact = await db.contacts.create({
    data: {
      userId: user.id,
      url: `cal.com/${username}`,
      name,
      username,
      checkInFrequency,
      tag,
      eventType: {
        createMany: {
          data: eventsToCreate,
        },
      },
      calId: 12,
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
