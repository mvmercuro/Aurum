import { ForbiddenError } from "@/lib/errors";
import axios, { type AxiosInstance } from "axios";
import type { User } from "@/drizzle/schema";

// import { ENV } from "@/lib/env"; // Removed

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

class OAuthService {
  constructor(private client: ReturnType<typeof axios.create>) { }

  async getTokenByCode(code: string, state: string): Promise<any> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }

  async getUserInfoByToken(token: any): Promise<any> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }
}

class SDKServer {
  private readonly client: AxiosInstance;
  private readonly oauthService: OAuthService;

  constructor() {
    this.client = axios.create();
    this.oauthService = new OAuthService(this.client);
  }

  async exchangeCodeForToken(code: string, state: string): Promise<any> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }

  async getUserInfo(accessToken: string): Promise<any> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }

  async createSessionToken(openId: string, options: any = {}): Promise<string> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }

  async verifySession(cookieValue: string | undefined | null): Promise<any> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }

  async authenticateRequest(req: any): Promise<User> {
    throw new Error("Legacy OAuth not supported. Use Supabase Auth.");
  }
}

export const sdk = new SDKServer();

