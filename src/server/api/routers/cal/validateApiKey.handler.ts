import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../../trpc";
import type { TValidateApiKeySchema } from "./validateApiKey.schema";

import meCal from "@/lib/me";

export const validateApiKeyHandler = async ({
  input,
}: {
  input: TValidateApiKeySchema;
}) => {
  const validApiKey = await meCal(input.apiKey);

  if (!validApiKey) {
    return false;
  }

  return true;
};

export default validateApiKeyHandler;
