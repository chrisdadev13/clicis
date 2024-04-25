import { db } from "@/server/db";
import type { TRPCContext } from "../../trpc";

type ListOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
};

export const listHandler = async ({ ctx }: ListOptions) => {
  const { user } = ctx.session;

  const contacts = await db.contacts.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      username: true,
      name: true,
      checkInFrequency: true,
      active: true,
      tag: true,
    },
    orderBy: {
      checkInFrequency: "desc",
    },
  });

  if (!contacts.length) {
    return [];
  }

  return contacts;
};

export default listHandler;
