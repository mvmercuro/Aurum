import { publicProcedure, router } from "./trpc";
import { createClient } from "@/lib/supabase/server";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }),
    logout: publicProcedure.mutation(async () => {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
