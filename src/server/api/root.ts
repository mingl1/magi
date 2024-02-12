import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { connections } from "~/server/api/routers/connections";
// import { gameConnections } from "~/server/api/routers/gameConnections";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  connections: connections,
});

// export type definition of API
export type AppRouter = typeof appRouter;
