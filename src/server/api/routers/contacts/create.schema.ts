import { z } from "zod";

import slugify from "@/lib/slugify";

import { CheckInTime } from "@prisma/client";

export const calUrlPattern = /^(?:https?:\/\/)?cal\.com\/([^\/?]+)/;
//export const calUrlPattern = /^https:\/\/cal\.com\/([^\/]+)\/([^\/]+)$/;
//export const calUrlPattern = /^(https?:\/\/)?cal\.com\/([^\/]+)\/([^\/]+)$/;
//export const calUrlPattern = /^(?:https?:\/\/)?cal\.com\/([^\/]+)\/([^\/?]+)$/;

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

// Username is going to be inferred from the URL
// or we can have a separate field for the username
// so the input is going to accept two types
// cal.com url or cal.com username
export const ZCreateSchema = z.object({
  identifier: CalUrlSchema.or(CalUsernameSchema),
  name: z.string().min(1).max(100),
  checkInFrequency: z.nativeEnum(CheckInTime),
  tag: z.string(),
});

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
