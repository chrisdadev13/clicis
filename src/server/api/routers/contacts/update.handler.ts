import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { calUrlPattern } from "./create.schema";
import type { TRPCContext } from "../../trpc";
import type { TUpdateSchema } from "./update.schema";
import validateCalUsername from "@/lib/validateCalUsername";
import { type Prisma } from "@prisma/client";

type UpdateOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TUpdateSchema;
};

export const updateHandler = async ({ ctx, input }: UpdateOptions) => {
  const { user } = ctx.session;
  const { id, identifier, name, checkInFrequency, tag } = input;

  let data: Prisma.ContactsUpdateInput = {};

  const contact = await db.contacts.findFirst({
    where: {
      id,
      userId: user.id,
    },
    select: {
      eventType: true,
    },
  });
  if (!contact) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Contact not found",
    });
  }

  if (identifier) {
    const { username } = extractUsername(identifier);

    if (!username)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid URL format for cal.com",
      });

    const calUsernameExists = await validateCalUsername(username);

    if (calUsernameExists?.available) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The username doesn't exist on cal.com",
      });
    }

    data = { ...data, username, url: identifier };
  }

  if (tag) {
    data = { ...data, tag };
  }

  if (name) {
    data = { ...data, name };
  }

  if (checkInFrequency) {
    data = { ...data, checkInFrequency };
  }

  return await db.contacts.update({
    where: { id },
    data,
  });
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

export default updateHandler;
