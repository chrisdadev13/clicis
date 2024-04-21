import perfMiddleware from "../middlewares/perfMiddleware";
import { procedure } from "../trpc";

export const publicProcedure = procedure.use(perfMiddleware);
