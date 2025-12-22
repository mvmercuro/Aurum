declare namespace NodeJS {
  interface ProcessEnv {
    // Public (client-side)
    NEXT_PUBLIC_APP_ID: string
    NEXT_PUBLIC_OAUTH_PORTAL_URL: string
    
    // Private (server-side only)
    DATABASE_URL: string
    OAUTH_SERVER_URL: string
    JWT_SECRET: string
    OWNER_OPEN_ID: string
    BUILT_IN_FORGE_API_URL: string
    BUILT_IN_FORGE_API_KEY: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
