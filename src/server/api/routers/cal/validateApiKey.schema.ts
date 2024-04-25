import { z } from "zod";

export const ZValidateApiKeySchema = z.object({
  apiKey: z.string(),
});

export type TValidateApiKeySchema = z.infer<typeof ZValidateApiKeySchema>;
