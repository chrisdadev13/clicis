import { protectedProcedure } from "../../procedures/protectedProcedure";
import { importHandler, router } from "../../trpc";
import { ZCreateSchema } from "./create.schema";
import { ZUpdateSchema } from "./update.schema";
import { ZDeleteSchema } from "./delete.schema";

const NAMESPACE = "contact";
const namespaced = (s: string) => `${NAMESPACE}.${s}`;

export const contactsRouter = router({
  create: protectedProcedure.input(ZCreateSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("create"),
      () => import("./create.handler"),
    );
    return handler(opts);
  }),
  list: protectedProcedure.query(async (opts) => {
    const handler = await importHandler(
      namespaced("list"),
      () => import("./list.handler"),
    );
    return handler(opts);
  }),
  update: protectedProcedure.input(ZUpdateSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("update"),
      () => import("./update.handler"),
    );
    return handler(opts);
  }),
  delete: protectedProcedure.input(ZDeleteSchema).mutation(async (opts) => {
    const handler = await importHandler(
      namespaced("delete"),
      () => import("./delete.handler"),
    );
    return handler(opts);
  }),
});
