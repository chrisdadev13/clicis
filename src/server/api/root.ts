import { createCallerFactory, router } from "@/server/api/trpc";
import { usersRouter } from "./routers/user/_router";
import { contactsRouter } from "./routers/contacts/_router";
import { calRouter } from "./routers/cal/_router";

export const appRouter = router({
  cal: calRouter,
  contacts: contactsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
