import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../../trpc";
import type { TCheckAvailabilitySchema } from "./checkAvailability.schema";

import axios from "axios";

type CheckAvailabilityOptions = {
  ctx: {
    session: NonNullable<TRPCContext["session"]>;
  };
  input: TCheckAvailabilitySchema;
};

export const checkAvailabilityHandler = async ({
  ctx,
  input,
}: CheckAvailabilityOptions) => {};
