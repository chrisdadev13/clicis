import { db } from "@/server/db";
import type { TRPCContext } from "../../trpc";
import type { TGetEventsSchema } from "./getEvents.schema";

type GetEventsOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TGetEventsSchema;
};

export const getEventsHandler = async ({ input }: GetEventsOptions) => {
  const { contactId } = input;

  const events = await db.eventTypes.findMany({
    where: {
      contactId: contactId,
    },
    select: {
      id: true,
      calId: true,
      title: true,
      slug: true,
      contact: true,
    },
  });

  if (!events.length) {
    return [];
  }

  return events;
};

export default getEventsHandler;
