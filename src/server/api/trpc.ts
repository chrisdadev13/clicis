import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;

// eslint-disable-next-line @typescript-eslint/ban-types
const UNSTABLE_HANDLER_CACHE: Record<string, Function> = {};

export const importHandler = async <
  T extends {
    // eslint-disable-next-line @typescript-eslint/ban-types
    default: Function;
  },
>(
  name: string,
  importer: () => Promise<T>,
) => {
  const nameInCache = name;

  if (!UNSTABLE_HANDLER_CACHE[nameInCache]) {
    const importedModule = await importer();
    UNSTABLE_HANDLER_CACHE[nameInCache] = importedModule.default;
    return importedModule.default as T["default"];
  }

  return UNSTABLE_HANDLER_CACHE[nameInCache] as unknown as T["default"];
};
