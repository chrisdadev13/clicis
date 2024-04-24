import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../../trpc";
import type { TSetupSchema } from "./setup.schema";
import meCal, { type UnauthorizedResponse, type UserResponse } from "@/lib/me";

type CreateOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };

  input: TSetupSchema;
};

export const setupHandler = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx.session;
  const { calApiKey } = input;

  const validApiKey = await meCal(calApiKey);

  if (!validApiKey) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Cal.com API key",
    });
  }

  if ((validApiKey as UnauthorizedResponse).error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Cal.com API key",
    });
  }

  const { user: calUser } = validApiKey as UserResponse;

  const userExists = await db.user.findFirst({
    where: {
      username: calUser.username,
    },
    select: {
      id: true,
    },
  });

  if (userExists) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "User already exists",
    });
  }

  const userUpdated = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      calId: calUser.id,
      name: calUser.name,
      username: calUser.username,
      weekStart: calUser.weekStart,
      timeZone: calUser.timeZone,
      apiKey: calApiKey,
    },
  });

  return userUpdated;
};

export default setupHandler;
