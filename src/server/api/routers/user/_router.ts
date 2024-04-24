import { protectedProcedure } from "../../procedures/protectedProcedure";
import { importHandler, router } from "../../trpc";
import { ZSetupSchema } from "./setup.schema";

const NAMESPACE = "user";
const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const usersRouter = router({
  setup: protectedProcedure.input(ZSetupSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("setup"),
      () => import("./setup.handler"),
    );
    return handler(opts);
  }),
});
