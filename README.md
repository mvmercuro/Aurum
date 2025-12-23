# Aurum Cannabis Delivery Platform

A complete cannabis delivery e-commerce platform built with Next.js 15, PostgreSQL, and Drizzle ORM.

## 🌟 Features

### Customer-Facing
- **Product Catalog** - Browse products by category (Flower, Vapes, Edibles, etc.)
- **Product Details** - Detailed product pages with THC/CBD info, effects, and reviews
- **Shopping Cart** - Add products, adjust quantities, view totals
- **Delivery Zones** - Check service availability by ZIP code
- **Order Tracking** - Track order status from confirmation to delivery
- **Loyalty Program** - Rewards system for repeat customers

### Admin Dashboard
- **Order Management** - View, update, and assign orders to drivers
- **Product Management** - Add, edit, delete products with image upload
- **Inventory Tracking** - Real-time stock levels with low-stock alerts
- **Driver Assignment** - Assign orders to delivery drivers
- **Print Receipts** - Generate printable order receipts

### Technical Features
- **Next.js 15** - App Router for modern performance and SEO
- **Server Components** - Optimized data fetching and rendering
- **PostgreSQL** - Robust relational database (with Drizzle ORM)
- **Responsive Design** - Mobile-first, works on all devices
- **Real-time Updates** - Live inventory and order status

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22.13.0+
- pnpm package manager
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/aurum-cannabis-delivery.git
cd aurum-cannabis-delivery

# Install dependencies
pnpm install

# Setup Environment Variables
# Copy .env.example to .env.local and fill in your details
cp .env.local.example .env.local

# Run database migrations
pnpm db:push

# Seed the database (optional)
npx tsx scripts/seed.mjs

# Start development server
pnpm dev
```

### Access
- **Frontend:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin/login

---

## 📁 Project Structure

```
├── app/                     # Next.js App Router
│   ├── admin/              # Admin routes (protected)
│   ├── api/                # API Route handlers
│   ├── product/            # Product pages
│   └── ...                 # Other routes
├── components/              # React components
│   ├── ui/                 # shadcn/ui primitives
│   └── ...                 # Feature components
├── drizzle/                 # Database schema and migrations
├── lib/                     # Utilities and shared logic
│   ├── api.ts              # API client
│   ├── auth.ts             # Authentication logic
│   └── db.ts               # Database connection
├── public/                  # Static assets
├── scripts/                 # Utility scripts (seeding, etc.)
└── package.json            # Dependencies and scripts
```

---

## 🛠️ Tech Stack

### Frontend & Backend
- **Next.js 15** - Full-stack React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library

### Database & Data
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database ORM
- **Drizzle Kit** - Database migrations

### Infrastructure
- **Vercel** - Recommended deployment platform
- **TypeScript** - Type safety
- **pnpm** - Package manager

---

## 📊 Database Schema

### Main Tables
- **regions** - Service areas (SFV, LA, OC) with delivery fees
- **zipCodes** - ZIP codes linked to regions
- **categories** - Product categories
- **products** - Products with inventory, pricing, strain info
- **orders** - Customer orders with status tracking
- **orderItems** - Line items for each order
- **drivers** - Delivery drivers
- **orderAssignments** - Links orders to drivers
- **users** - User authentication

---

## 🔐 Admin Dashboard

### Methods
- **OAuth Login**: Secure login via configured OAuth provider
- **Dev Bypass**: In development, simulated login may be available

### Features

**Orders Tab:**
- View all orders with customer details
- Update order status
- Assign drivers
- Print receipts

**Products Tab:**
- Add new products with full details
- Upload product images
- Edit existing products
- Delete products

**Inventory Tab:**
- View all products with stock levels
- Update inventory counts
- Color-coded stock status

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run database migrations
pnpm db:push

# Type check
pnpm type-check

# Lint code
pnpm lint
```

### Environment Variables
Managed via `.env.local`. Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_ID` - Application ID
- `JWT_SECRET` - JWT signing secret

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

See `DEPLOY_TO_VERCEL.md` for detailed instructions.

---

## 📄 License

Private - All Rights Reserved
