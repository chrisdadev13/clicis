import { z } from "zod";

export const ZGetEventsSchema = z.object({
  contactId: z.string().min(1),
  contactCalId: z.number(),
});

export type TGetEventsSchema = z.infer<typeof ZGetEventsSchema>;
