import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../../trpc";
import type { TDeleteSchema } from "./delete.schema";

type DeleteOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TDeleteSchema;
};

export const deleteHandler = async ({ ctx, input }: DeleteOptions) => {
  const { user } = ctx.session;
  const { id } = input;

  const category = await db.tags.findFirst({
    where: { id, userId: user.id },
  });

  if (!category) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Category not found",
    });
  }

  await db.tags.delete({
    where: { id },
  });

  return {
    message: "Category deleted",
  };
};

export default deleteHandler;
