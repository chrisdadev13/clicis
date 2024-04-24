import { protectedProcedure } from "../../procedures/protectedProcedure";
import { importHandler, router } from "../../trpc";
import { ZCheckAvailabilitySchema } from "./checkAvailability.schema";

const NAMESPACE = "cal";
const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const calRouter = router({
  checkAvailabilityAndSave: protectedProcedure
    .input(ZCheckAvailabilitySchema)
    .mutation(async (opts) => {
      const handler = await importHandler(
        namespaced("checkAvailability"),
        () => import("./checkAvailability.handler"),
      );

      return handler(opts);
    }),
});
