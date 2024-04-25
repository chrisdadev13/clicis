import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../../trpc";
import type { TDeleteSchema } from "./deleteCheckIn.schema";

type DeleteOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  const { user } = ctx.session;
  const { id } = input;

  const checkIn = await db.checkIns.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  console.log("checkIn", checkIn);

  if (!checkIn) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Contact not found",
    });
  }

  await db.checkIns.delete({
    where: {
      id: id,
    },
  });

  return { success: true };
};

export default deleteHandler;
