import { CalUrlSchema } from "./create.schema";
import { CheckInTime } from "@prisma/client";
import { z } from "zod";

export const ZUpdateSchema = z.object({
  id: z.string().min(1),
  identifier: CalUrlSchema.nullable().optional(),
  name: z.string().min(1).max(100).nullable().optional(),
  checkInFrequency: z.nativeEnum(CheckInTime).nullable().optional(),
  tag: z.string().nullable().optional(),
});

export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
