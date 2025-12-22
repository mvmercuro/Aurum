import type { User } from "@/drizzle/schema";

export type TrpcContext = {
  req: any;
  res: any;
  user: User | null;
};
