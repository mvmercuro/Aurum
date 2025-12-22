# Next.js Migration Plan for Aurum

**Status:** Ready for Implementation
**Estimated Timeline:** 8-12 hours
**Risk Level:** Low-Medium
**Compatibility:** Verified

---

## Executive Summary

This document outlines a comprehensive migration plan from the current Vite + React + Wouter + Express stack to Next.js 15 App Router. The migration preserves all existing functionality while improving performance, SEO, and maintainability.

### Key Benefits
- ✅ **Better Performance**: Server-side rendering and automatic code splitting
- ✅ **Improved SEO**: Dynamic metadata and structured data support
- ✅ **Simplified Architecture**: Single framework instead of Vite + Express
- ✅ **Enhanced DX**: Better TypeScript integration and debugging
- ✅ **Future-Proof**: Modern React patterns (Server Components)

---

## Current Architecture Analysis

### Tech Stack
- **Frontend**: React 19.2.1, Wouter 3.3.5 (routing)
- **Build Tool**: Vite 7.1.7
- **Backend**: Express 4.21.2
- **API**: tRPC 11.6.0 + REST endpoints
- **Database**: Drizzle ORM 0.44.5 + PostgreSQL (Supabase)
- **Styling**: Tailwind CSS 4.1.14, shadcn/ui
- **State**: React Query 5.90.2

### Current Routes
```
/ → Home
/shop → Shop (product catalog)
/product/:id → ProductDetail
/delivery-zones → DeliveryZones
/about → AboutUs
/loyalty → Loyalty
/admin/login → AdminLogin
/admin → Admin (protected)
/track → TrackOrder
```

### API Endpoints
- **tRPC**: `/api/trpc/*` (auth, system)
- **REST**: `/api/products`, `/api/orders`, `/api/admin`
- **OAuth**: `/api/oauth/callback`

---

## Target Architecture

### Next.js 15 App Router
- **Frontend**: React 19 + Next.js App Router
- **Routing**: File-based with Server Components
- **API**: Next.js Route Handlers + tRPC adapter
- **Database**: Drizzle ORM (no changes)
- **Styling**: Tailwind CSS (no changes)
- **State**: React Query (client-side only)

### File Structure
```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── globals.css             # Global styles
├── providers.tsx           # Client providers
├── shop/page.tsx
├── product/[id]/page.tsx
├── delivery-zones/page.tsx
├── about/page.tsx
├── loyalty/page.tsx
├── track/page.tsx
├── admin/
│   ├── layout.tsx          # Auth guard
│   ├── page.tsx
│   └── login/page.tsx
├── api/
│   ├── trpc/[trpc]/route.ts
│   ├── products/route.ts
│   ├── orders/route.ts
│   ├── admin/[...path]/route.ts
│   └── oauth/callback/route.ts
└── not-found.tsx

components/               # React components (no changes)
lib/                     # Utilities (reorganized)
hooks/                   # React hooks (no changes)
contexts/                # React contexts (no changes)
server/                  # Server-only code
shared/                  # Shared types
drizzle/                 # Database (no changes)
public/                  # Static assets
middleware.ts            # Auth middleware
```

---

## Migration Phases

### Phase 1: Setup and Configuration ⚙️

**Objective**: Prepare Next.js environment

#### Steps:
1. Install Next.js dependencies
   ```bash
   pnpm add next@15 @trpc/next@11 sharp
   ```

2. Remove Vite dependencies
   ```bash
   pnpm remove vite @vitejs/plugin-react esbuild wouter express tsx cookie
   ```

3. Create `next.config.mjs`
   ```javascript
   /** @type {import('next').NextConfig} */
   export default {
     experimental: {
       serverActions: true,
     },
     typescript: {
       ignoreBuildErrors: false,
     },
   }
   ```

4. Update `package.json` scripts
   ```json
   {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint",
     "type-check": "tsc --noEmit"
   }
   ```

5. Create `tsconfig.json` for Next.js
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [{ "name": "next" }],
       "paths": {
         "@/*": ["./*"],
         "@/components/*": ["./components/*"],
         "@/lib/*": ["./lib/*"]
       }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

6. Update `.env.local` variables
   ```env
   # Rename VITE_* to NEXT_PUBLIC_*
   NEXT_PUBLIC_APP_ID=<app-id>
   NEXT_PUBLIC_OAUTH_PORTAL_URL=<url>

   # Keep server-only vars
   DATABASE_URL=postgresql://...
   OAUTH_SERVER_URL=<url>
   JWT_SECRET=<secret>
   OWNER_OPEN_ID=<openid>
   BUILT_IN_FORGE_API_URL=<url>
   BUILT_IN_FORGE_API_KEY=<key>
   ```

7. Create `env.d.ts` for TypeScript
   ```typescript
   declare namespace NodeJS {
     interface ProcessEnv {
       NEXT_PUBLIC_APP_ID: string
       NEXT_PUBLIC_OAUTH_PORTAL_URL: string
       DATABASE_URL: string
       // ... other vars
     }
   }
   ```

**Testing**: `pnpm install` completes successfully

---

### Phase 2: Static Assets and Styles 🎨

**Objective**: Migrate CSS and static files

#### Steps:
1. Create `public/` directory at root
2. Move `client/public/*` → `public/*`
3. Create `app/globals.css`
   - Copy content from `client/src/index.css`
   - Keep all Tailwind directives
   - Keep CSS variables for theme

4. Update `tailwind.config.ts`
   ```typescript
   export default {
     content: [
       './app/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     // ... keep existing theme config
   }
   ```

5. Update `components.json` (shadcn/ui)
   ```json
   {
     "aliases": {
       "components": "@/components",
       "utils": "@/lib/utils"
     }
   }
   ```

**Testing**: Tailwind builds without errors

---

### Phase 3: Shared Code and Utilities 🔧

**Objective**: Reorganize shared code

#### Steps:
1. Create `lib/` directory structure
   ```
   lib/
   ├── db.ts          # From server/db.ts
   ├── storage.ts     # From server/storage.ts
   ├── auth.ts        # New auth utilities
   ├── env.ts         # From server/_core/env.ts
   ├── api.ts         # From client/src/lib/api.ts
   ├── trpc.ts        # From client/src/lib/trpc.ts
   ├── utils.ts       # From client/src/lib/utils.ts
   └── types.ts       # From shared/types.ts
   ```

2. Create `lib/auth.ts`
   ```typescript
   import { cookies } from 'next/headers'
   import { sdk } from '@/server/sdk'

   export async function getUser() {
     const cookieStore = await cookies()
     const sessionCookie = cookieStore.get('session')

     if (!sessionCookie) return null

     return await sdk.validateSession(sessionCookie.value)
   }

   export async function requireAuth() {
     const user = await getUser()
     if (!user) {
       redirect('/admin/login')
     }
     return user
   }

   export async function requireAdmin() {
     const user = await requireAuth()
     if (user.role !== 'admin') {
       redirect('/')
     }
     return user
   }
   ```

3. Update all import paths
   - Replace `@/` references to point to new structure
   - Replace `@shared/` references to `@/lib/`

**Testing**: TypeScript compiles with updated imports

---

### Phase 4: Components Migration 🧩

**Objective**: Move components to new structure

#### Steps:
1. Create `components/` directory at root
2. Move `client/src/components/ui/*` → `components/ui/*`
3. Move `client/src/components/*` → `components/*`
4. Add 'use client' directives to client components
   ```typescript
   'use client'

   export function ProductCard({ ... }) {
     // Component with interactivity
   }
   ```

5. Update import paths in all components
6. Keep `hooks/` and `contexts/` directories
7. Add 'use client' to context providers

**Client Components (need 'use client'):**
- All components with useState, useEffect, onClick handlers
- Layout (navigation, interactive UI)
- Forms and inputs
- Theme context
- All UI components from shadcn/ui

**Server Components (no directive):**
- ProductCard can stay server (if no interactivity)
- Static content components

**Testing**: All components import correctly

---

### Phase 5: API Routes Migration 🚀

**Objective**: Convert Express/tRPC to Next.js Route Handlers

#### tRPC Setup

**Create `app/api/trpc/[trpc]/route.ts`:**
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers'
import { createContext } from '@/server/context'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  })

export { handler as GET, handler as POST }
```

**Update `server/context.ts`:**
```typescript
import { getUser } from '@/lib/auth'

export async function createContext() {
  const user = await getUser()
  return { user }
}
```

#### REST Routes

**Create `app/api/products/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { products } from '@/drizzle/schema'

export async function GET(request: NextRequest) {
  const db = await getDb()
  const allProducts = await db.select().from(products)

  return NextResponse.json(allProducts)
}
```

**Create `app/api/products/[id]/route.ts`:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDb()
  const product = await db.select()
    .from(products)
    .where(eq(products.id, parseInt(params.id)))
    .limit(1)

  if (!product[0]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(product[0])
}
```

**Create `app/api/orders/route.ts`:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate ZIP
  const db = await getDb()
  const validZip = await db.select()
    .from(zipCodes)
    .where(eq(zipCodes.zipCode, body.zipCode))
    .limit(1)

  if (!validZip[0]) {
    return NextResponse.json({ error: 'Invalid ZIP' }, { status: 400 })
  }

  // Create order
  const [order] = await db.insert(orders)
    .values({ ...body })
    .returning()

  return NextResponse.json(order)
}
```

**Create `app/api/admin/[...path]/route.ts`:**
```typescript
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const user = await requireAdmin()

  const [resource] = params.path

  // Route to appropriate handler
  if (resource === 'orders') {
    return getOrders()
  } else if (resource === 'products') {
    return getProducts()
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function POST(request: NextRequest, { params }) {
  const user = await requireAdmin()
  // Handle admin POST requests
}
```

**Create `app/api/oauth/callback/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sdk } from '@/server/sdk'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect('/admin/login?error=invalid_callback')
  }

  // Exchange code for token
  const token = await sdk.exchangeCodeForToken(code)
  const userInfo = await sdk.getUserInfo(token)

  // Upsert user to database
  const db = await getDb()
  const [user] = await db.insert(users)
    .values({ ...userInfo })
    .onConflictDoUpdate({ target: users.openId, set: userInfo })
    .returning()

  // Create session
  const sessionToken = await sdk.createSessionToken(user)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return NextResponse.redirect('/admin')
}
```

**Testing**: All API endpoints respond correctly

---

### Phase 6: Page Routes Migration 📄

**Objective**: Convert pages to Next.js App Router

#### Root Layout

**Create `app/layout.tsx`:**
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Aurum',
    default: 'Aurum - Premium Cannabis Delivery',
  },
  description: 'Premium cannabis delivery in Southern California',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

**Create `app/providers.tsx`:**
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { ThemeProvider } from '@/contexts/theme-context'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

#### Pages

**Create `app/page.tsx` (Home):**
```typescript
import { Layout } from '@/components/layout'

export default function HomePage() {
  return (
    <Layout>
      {/* Home page content */}
    </Layout>
  )
}
```

**Create `app/shop/page.tsx`:**
```typescript
import { getDb } from '@/lib/db'
import { products } from '@/drizzle/schema'
import { ShopClient } from './shop-client'

export default async function ShopPage() {
  const db = await getDb()
  const allProducts = await db.select().from(products)

  return (
    <Layout>
      <ShopClient initialProducts={allProducts} />
    </Layout>
  )
}
```

**Create `app/shop/shop-client.tsx`:**
```typescript
'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/product-card'

export function ShopClient({ initialProducts }) {
  const [filter, setFilter] = useState('')

  // Client-side filtering logic
  const filtered = initialProducts.filter(...)

  return (
    <div>
      {/* Filters and product grid */}
    </div>
  )
}
```

**Create `app/product/[id]/page.tsx`:**
```typescript
import { getDb } from '@/lib/db'
import { products } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const db = await getDb()
  const [product] = await db.select()
    .from(products)
    .where(eq(products.id, parseInt(params.id)))
    .limit(1)

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  }
}

export default async function ProductPage({ params }) {
  const db = await getDb()
  const [product] = await db.select()
    .from(products)
    .where(eq(products.id, parseInt(params.id)))
    .limit(1)

  if (!product) notFound()

  return (
    <Layout>
      <ProductDetail product={product} />
    </Layout>
  )
}
```

**Create `app/admin/layout.tsx`:**
```typescript
import { requireAdmin } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div>
      <AdminNav user={user} />
      {children}
    </div>
  )
}
```

**Create `app/admin/page.tsx`:**
```typescript
import { AdminDashboard } from '@/components/admin-dashboard'

export default function AdminPage() {
  return <AdminDashboard />
}
```

**Create `app/not-found.tsx`:**
```typescript
import { Layout } from '@/components/layout'

export default function NotFound() {
  return (
    <Layout>
      <div className="text-center">
        <h1>404 - Page Not Found</h1>
      </div>
    </Layout>
  )
}
```

**Testing**: All pages render correctly

---

### Phase 7: Client-Side Setup ⚛️

**Objective**: Configure tRPC and React Query for Next.js

**Update `lib/trpc.ts`:**
```typescript
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/server/routers'

export const trpc = createTRPCReact<AppRouter>()
```

**Update `lib/api.ts`:**
```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // Next.js handles this
})

export const productsApi = {
  getAll: () => api.get('/products').then(res => res.data),
  getById: (id: number) => api.get(`/products/${id}`).then(res => res.data),
}

export const ordersApi = {
  create: (order: any) => api.post('/orders', order).then(res => res.data),
  track: (orderNumber: string, phone: string) =>
    api.get(`/orders/${orderNumber}?phone=${phone}`).then(res => res.data),
}
```

**Testing**: Client-side navigation and data fetching work

---

### Phase 8: Middleware and Auth 🔐

**Objective**: Set up authentication middleware

**Create `middleware.ts` at root:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const user = await getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Testing**: Auth protection works on admin routes

---

### Phase 9: Testing and Validation ✅

**Objective**: Comprehensive testing

#### Type Safety
```bash
pnpm type-check
# Expected: 0 errors
```

#### Development Server
```bash
pnpm dev
# Test: Navigate to all routes
# Verify: No console errors
```

#### Functional Testing Checklist
- [ ] Home page loads
- [ ] Shop page displays products
- [ ] Product detail page works with dynamic routes
- [ ] Static pages render (about, delivery-zones, loyalty)
- [ ] Track order form works
- [ ] OAuth login flow works
- [ ] Admin routes protected
- [ ] Admin dashboard loads
- [ ] Product CRUD works (admin)
- [ ] Order management works (admin)
- [ ] File uploads work
- [ ] Dark mode toggle works
- [ ] Mobile responsive

#### API Testing
```bash
# tRPC
curl http://localhost:3000/api/trpc/auth.me

# REST
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/1
```

#### Build Testing
```bash
pnpm build
# Expected: Successful build
# Check: .next/ directory created
```

#### Production Testing
```bash
pnpm start
# Test all routes in production mode
```

---

### Phase 10: Optimization and Deployment 🚀

**Objective**: Optimize and deploy

#### Performance Optimizations

1. **Convert to Server Components where possible**
2. **Add next/image for images**
   ```typescript
   import Image from 'next/image'

   <Image
     src={product.imageUrl}
     alt={product.name}
     width={400}
     height={300}
     priority={isAboveFold}
   />
   ```

3. **Add loading states**
   ```typescript
   // app/shop/loading.tsx
   export default function Loading() {
     return <div>Loading...</div>
   }
   ```

4. **Add error boundaries**
   ```typescript
   // app/shop/error.tsx
   'use client'

   export default function Error({ error, reset }) {
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={reset}>Try again</button>
       </div>
     )
   }
   ```

5. **Dynamic imports for heavy components**
   ```typescript
   import dynamic from 'next/dynamic'

   const AdminDashboard = dynamic(() => import('@/components/admin-dashboard'), {
     loading: () => <Spinner />,
   })
   ```

#### SEO Enhancements

**Add `app/sitemap.ts`:**
```typescript
import { MetadataRoute } from 'next'
import { getDb } from '@/lib/db'
import { products } from '@/drizzle/schema'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb()
  const allProducts = await db.select().from(products)

  return [
    {
      url: 'https://aurum.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://aurum.com/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...allProducts.map((product) => ({
      url: `https://aurum.com/product/${product.id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
```

**Add `app/robots.ts`:**
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://aurum.com/sitemap.xml',
  }
}
```

#### Deployment

1. **Clean up old files**
   - Delete `client/` directory
   - Delete `server/_core/index.ts`
   - Delete `server/routes/`
   - Delete `vite.config.ts`
   - Delete `vercel.json` (not needed)

2. **Update `.gitignore`**
   ```
   .next/
   out/
   ```

3. **Deploy to Vercel**
   ```bash
   # Vercel auto-detects Next.js
   vercel
   ```

4. **Set environment variables in Vercel dashboard**

5. **Monitor deployment**
   - Check logs for errors
   - Test all functionality
   - Monitor performance metrics

---

## Rollback Plan

If critical issues are encountered:

1. **Immediate Rollback**
   ```bash
   git checkout main
   pnpm install
   pnpm dev
   ```

2. **Document Issues**
   - Log errors encountered
   - Note which phase failed
   - Gather error messages and stack traces

3. **Plan Remediation**
   - Analyze root cause
   - Update migration plan
   - Test fixes in isolation

4. **Re-attempt Migration**
   - Apply fixes
   - Resume from failed phase
   - Continue with enhanced monitoring

---

## Success Criteria

### Functional Requirements ✅
- [ ] All routes accessible
- [ ] Authentication flow works
- [ ] Admin routes protected
- [ ] Product listing and detail pages work
- [ ] Order creation and tracking work
- [ ] File uploads functional
- [ ] Database operations work
- [ ] All API endpoints respond correctly

### Technical Requirements ⚙️
- [ ] TypeScript compiles without errors
- [ ] Development server runs cleanly
- [ ] Production build succeeds
- [ ] All environment variables configured
- [ ] No console errors in browser

### Performance Requirements 🚀
- [ ] Initial page load < 2s
- [ ] Lighthouse score >= 90
- [ ] Core Web Vitals pass
- [ ] Bundle size <= current or smaller

### UI/UX Requirements 🎨
- [ ] Visual parity with current app
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Animations and transitions work
- [ ] Forms function correctly

### SEO Requirements 📈
- [ ] Meta tags on all pages
- [ ] Open Graph configured
- [ ] sitemap.xml generated
- [ ] robots.txt configured

---

## Post-Migration Monitoring

### First 24 Hours
- Monitor production logs
- Track error rates
- Monitor performance metrics
- Gather user feedback
- Check database query performance

### First Week
- Analyze performance vs baseline
- Review Core Web Vitals
- Check SEO rankings
- Monitor server costs
- Gather stakeholder feedback

---

## Resources

### Official Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [tRPC Next.js Guide](https://trpc.io/docs/client/nextjs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)

### Key Files
- Current codebase: `/c/Users/mmerc/Aurum/Aurum/`
- Migration branch: `feat/nextjs-migration`
- This plan: `NEXTJS_MIGRATION_PLAN.md`

---

## Timeline Estimate

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 1 | Setup and Configuration | 1 hour |
| 2 | Static Assets and Styles | 30 minutes |
| 3 | Shared Code and Utilities | 1 hour |
| 4 | Components Migration | 1 hour |
| 5 | API Routes Migration | 2 hours |
| 6 | Page Routes Migration | 2 hours |
| 7 | Client-Side Setup | 1 hour |
| 8 | Middleware and Auth | 1 hour |
| 9 | Testing and Validation | 2 hours |
| 10 | Optimization and Deployment | 1.5 hours |
| **Total** | **Complete Migration** | **8-12 hours** |

---

## Conclusion

This migration plan provides a systematic, low-risk approach to migrating from Vite + Express to Next.js 15. All critical dependencies are compatible, and the phased approach allows for testing and validation at each step. The expected outcome is a more performant, SEO-friendly, and maintainable application.

**Ready to proceed with implementation!**
