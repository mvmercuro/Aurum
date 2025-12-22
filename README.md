# Aurum Cannabis Delivery Platform

A complete cannabis delivery e-commerce platform with product management, order processing, inventory tracking, and admin dashboard.

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
- **Responsive Design** - Mobile-first, works on all devices
- **Real-time Updates** - Live inventory and order status
- **Image Upload** - S3-integrated product image storage
- **Secure Admin** - Password-protected admin dashboard
- **Database-Driven** - MySQL/TiDB with Drizzle ORM

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22.13.0+
- pnpm package manager
- MySQL or TiDB database

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/aurum-cannabis-delivery.git
cd aurum-cannabis-delivery

# Install dependencies
pnpm install

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
- **Admin Password:** `sfvadmin2024`

---

## 📁 Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── pages/          # Page components (Home, Shop, ProductDetail, Admin, etc.)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductManager.tsx
│   │   │   ├── InventoryManager.tsx
│   │   │   └── ...
│   │   ├── lib/            # Utilities and API client
│   │   ├── App.tsx         # Main app with routes
│   │   └── index.css       # Global styles and Tailwind config
│   └── public/             # Static assets
├── server/                  # Backend Express server
│   ├── routes/
│   │   ├── admin.ts        # Admin API endpoints
│   │   ├── products.ts     # Product API endpoints
│   │   ├── orders.ts       # Order API endpoints
│   │   └── ...
│   ├── db.ts               # Database connection and schema
│   └── index.ts            # Server entry point
├── drizzle/                 # Database migrations
├── scripts/                 # Utility scripts
│   └── seed.mjs            # Database seeding script
└── package.json            # Dependencies and scripts
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Wouter** - Lightweight routing
- **Lucide React** - Icon library

### Backend
- **Express** - Web server framework
- **Drizzle ORM** - Type-safe database ORM
- **Multer** - File upload handling
- **JWT** - Authentication

### Database
- **MySQL/TiDB** - Relational database
- **Drizzle Kit** - Database migrations

### Infrastructure
- **Vite** - Build tool and dev server
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

### Access
Navigate to `/admin/login` and enter password: `sfvadmin2024`

### Features

**Orders Tab:**
- View all orders with customer details
- Update order status
- Assign drivers
- Print receipts

**Products Tab:**
- Add new products with full details
- Upload product images (up to 5MB)
- Edit existing products
- Delete products

**Inventory Tab:**
- View all products with stock levels
- Update inventory counts
- Color-coded stock status:
  - 🟢 In Stock (5+ units)
  - 🟡 Low Stock (1-4 units)
  - 🔴 Out of Stock (0 units)

---

## 🎨 Customization

### Rebranding
Currently branded as "SFV Premium Cannabis". To rebrand to "Aurum":

1. Update `client/index.html` - Change `<title>` tag
2. Update `client/src/App.tsx` - Update header/logo
3. Update environment variables:
   - `VITE_APP_TITLE="Aurum"`
   - `VITE_APP_LOGO="[logo URL]"`

### Styling
- Global styles: `client/src/index.css`
- Tailwind config: Inline in `index.css` using `@theme`
- Component styles: Tailwind utility classes

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run database migrations
pnpm db:push

# Generate database types
pnpm db:generate

# Seed database
npx tsx scripts/seed.mjs
```

### Environment Variables
Managed automatically by Manus platform. Key variables:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo URL

---

## 🚀 Deployment

### Manus Platform (Recommended)
1. Save a checkpoint in the Manus UI
2. Click "Publish" button
3. Site is live with custom domain support

### External Hosting
1. Build the project: `pnpm build`
2. Set up MySQL database
3. Configure environment variables
4. Deploy to Vercel, Railway, or similar

---

## 📝 Notes

- Admin password should be changed in production
- Product images are stored in S3
- Database is pre-seeded with sample data
- All API endpoints are under `/api/`

---

## 🤝 Contributing

This is a private project. For access or questions, contact the repository owner.

---

## 📄 License

Private - All Rights Reserved

---

## 👥 Team

Built by Mike & Kelvin for Aurum Cannabis Delivery
