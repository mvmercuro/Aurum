import { publicProcedure, router } from "./trpc";
import { createClient } from "@/lib/supabase/server";
import { getUserByOpenId } from "@/lib/db";
import type { User } from "@/drizzle/schema";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(async (): Promise<User | null> => {
      const supabase = await createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) return null;

      const dbUser = await getUserByOpenId(authUser.id);
      return dbUser || null;
    }),
    logout: publicProcedure.mutation(async () => {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
