import perfMiddleware from "../middlewares/perfMiddleware";
import { isAuthed } from "../middlewares/sessionMiddleware";
import { procedure } from "../trpc";

export const protectedProcedure = procedure.use(perfMiddleware).use(isAuthed);
