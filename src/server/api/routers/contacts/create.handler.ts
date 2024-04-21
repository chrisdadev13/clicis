import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { calUrlPattern } from "./create.schema";
import type { TRPCContext } from "../../trpc";
import type { TCreateSchema } from "./create.schema";

type CreateOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TCreateSchema;
};

// identifier can be an url like: https://cal.com/username or https://cal.com/username/anything
// or just the cal.com username: username. if we receive a url with a path, we can extract
// the username from the path if we receive an username, we can construct the url from it
// (cal.com/username)
export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx.session;
  const { identifier, checkInFrequency, tags } = input;

  const tagsWithUserId = tags.map((tag) => ({
    userId: user.id,
    name: tag.name,
    color: tag.color,
  }));

  // if the identifier is a url, we can extract the username from the url
  // if not we assume it's a username and construct the url from it
  if (calUrlPattern.test(identifier)) {
    // if the identifier is a url, we can extract the username from the url
    // and use it to create the user
    const username = extractUsername(identifier);

    if (!username)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid URL format for cal.com",
      });

    const newContact = await db.contacts.create({
      data: {
        userId: user.id,
        url: identifier,
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
  }

  const newContact = await db.contacts.create({
    data: {
      userId: user.id,
      username: identifier,
      url: `https://cal.com/${identifier}`,
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
    return username;
  } else {
    return null;
  }
};

export default createHandler;
