import { z } from "zod";

export const ZDeleteSchema = z.object({
  id: z.string(),
});

export type TDeleteSchema = z.infer<typeof ZDeleteSchema>;
