import { protectedProcedure } from "../../procedures/protectedProcedure";
import { importHandler, router } from "../../trpc";
import { ZDeleteSchema } from "./delete.schema";

const NAMESPACE = "groups";
const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const categoriesRouter = router({
  delete: protectedProcedure.input(ZDeleteSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("delete"),
      () => import("./delete.handler"),
    );
    await handler(opts);
  }),
});
