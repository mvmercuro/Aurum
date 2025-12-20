# SFV Premium Cannabis Web App TODO

## Database Schema
- [ ] Create Region table (SFV, LA, OC with delivery fees and minimums)
- [ ] Create ZipCode table (linked to regions)
- [ ] Create Category table (Flower, Vapes, Edibles, etc.)
- [ ] Create Product table (with inventory, pricing, images)
- [ ] Create Order table (with customer info, status, payment method)
- [ ] Create Driver table (name, phone, active status)
- [ ] Create OrderAssignment table (link orders to drivers)

## Customer Features
- [ ] Product catalog page with categories, search, filters (connected to database)
- [ ] Product detail page (connected to database)
- [ ] "Request Delivery" form (Name, Phone, Address, ZIP validation)
- [ ] Order confirmation page
- [ ] Order status lookup page (by order number + phone)

## Admin Features
- [ ] Admin login page
- [ ] Admin dashboard (view orders by status)
- [ ] Order management (accept/decline, assign driver, update status)
- [ ] Product management (CRUD operations)
- [ ] Service area management (manage ZIP codes per region)
- [ ] Driver management

## Technical Features
- [ ] PWA setup (manifest, icons, offline shell)
- [ ] Mobile-first responsive design
- [ ] Age gate modal (21+) - already implemented
- [ ] Payment method: Cash/Debit on delivery (no online payment)
- [ ] ZIP code validation against database

## Documentation
- [ ] README with setup instructions
- [ ] Environment variables documentation
- [ ] Admin login credentials documentation


## API Endpoints
- [ ] GET /api/products (list all products with filters)
- [ ] GET /api/products/:id (get single product)
- [ ] GET /api/categories (list all categories)
- [ ] POST /api/orders (create delivery request)
- [ ] GET /api/orders/:orderNumber (lookup order status)
- [ ] POST /api/zip-check (validate ZIP code and get region info)

## Completed
- [x] Create Region table (SFV, LA, OC with delivery fees and minimums)
- [x] Create ZipCode table (linked to regions)
- [x] Create Category table (Flower, Vapes, Edibles, etc.)
- [x] Create Product table (with inventory, pricing, images)
- [x] Create Order table (with customer info, status, payment method)
- [x] Create Driver table (name, phone, active status)
- [x] Create OrderAssignment table (link orders to drivers)
- [x] Seed data for regions, ZIPs, categories, and sample products
- [x] Age gate modal implemented

- [x] GET /api/products (list all products with filters)
- [x] GET /api/products/:id (get single product)
- [x] GET /api/categories (list all categories)
- [x] POST /api/orders (create delivery request)
- [x] GET /api/orders/:orderNumber (lookup order status)
- [x] POST /api/orders/check-zip (validate ZIP code and get region info)
- [x] Product catalog page connected to database
- [x] Home page connected to database
