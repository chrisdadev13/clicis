import { z } from "zod";

const calApiKeyRegex = /^cal_live_[0-9a-f]{32}$/;

export const ZSetupSchema = z.object({
  calApiKey: z.string().regex(calApiKeyRegex, {
    message: "Invalid Cal.com API key format",
  }),
});

export type TSetupSchema = z.infer<typeof ZSetupSchema>;
