import { createTRPCRouter } from "./trpc";
import { farmerRouter } from "./routers/farmer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  farmer: farmerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
