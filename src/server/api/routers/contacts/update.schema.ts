import { CalUrlSchema } from "./create.schema";
import { CheckInTime } from "@prisma/client";
import { z } from "zod";

enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Purple = "purple",
  Orange = "orange",
  Pink = "pink",
  Brown = "brown",
  Black = "black",
  White = "white",
}

export const ZUpdateSchema = z.object({
  id: z.string().min(1),
  identifier: CalUrlSchema.nullable().optional(),
  name: z.string().min(1).max(100).nullable().optional(),
  checkInFrequency: z.nativeEnum(CheckInTime).nullable().optional(),
  tags: z
    .array(
      z.object({
        name: z.string(),
        color: z.nativeEnum(Color),
      }),
    )
    .nullable()
    .optional(),
});

export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
