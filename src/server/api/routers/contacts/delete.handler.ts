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

  const contact = await db.contacts.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!contact) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Contact not found",
    });
  }

  await Promise.all([
    db.tags.deleteMany({
      where: {
        contactId: id,
      },
    }),
    db.contacts.delete({
      where: {
        id,
      },
    }),
  ]);

  return { success: true };
};

export default deleteHandler;
