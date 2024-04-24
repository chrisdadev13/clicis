import { z } from "zod";

import slugify from "@/lib/slugify";

import { CheckInTime } from "@prisma/client";

// const calUrlPattern = /^(?:https?:\/\/)?cal\.com\/([^\/?]+)/;
//export const calUrlPattern = /^https:\/\/cal\.com\/([^\/]+)\/([^\/]+)$/;
// export const calUrlPattern = /^(https?:\/\/)?cal\.com\/([^\/]+)\/([^\/]+)$/;
export const calUrlPattern = /^(?:https?:\/\/)?cal\.com\/([^\/]+)\/([^\/?]+)$/;

export const CalUrlSchema = z.string().refine(
  (url) => {
    const pattern = calUrlPattern;
    return pattern.test(url);
  },
  {
    message: "Invalid URL format for cal.com",
  },
);

export const CalUsernameSchema = z.string().transform((s) => slugify(s));

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

// Username is going to be inferred from the URL
// or we can have a separate field for the username
// so the input is going to accept two types
// cal.com url or cal.com username
export const ZCreateSchema = z.object({
  identifier: CalUrlSchema.or(CalUsernameSchema),
  name: z.string().min(1).max(100),
  checkInFrequency: z.nativeEnum(CheckInTime),
  tags: z.array(
    z.object({
      name: z.string(),
      color: z.nativeEnum(Color),
    }),
  ),
});

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
