import { z } from "zod";

export const ZCheckAvailabilitySchema = z.object({
  eventId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});

export type TCheckAvailabilitySchema = z.infer<typeof ZCheckAvailabilitySchema>;
