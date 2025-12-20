# SFV Premium Cannabis Web App TODO

## Completed Features ✅

### Database & Backend
- [x] Create Region table (SFV, LA, OC with delivery fees and minimums)
- [x] Create ZipCode table (linked to regions)
- [x] Create Category table (Flower, Vapes, Edibles, etc.)
- [x] Create Product table (with inventory, pricing, images)
- [x] Create Order table (with customer info, status, payment method)
- [x] Create Driver table (name, phone, active status)
- [x] Create OrderAssignment table (link orders to drivers)
- [x] Seed data for regions, ZIPs, categories, and sample products

### API Endpoints
- [x] GET /api/products (list all products with filters)
- [x] GET /api/products/:id (get single product)
- [x] GET /api/categories (list all categories)
- [x] POST /api/orders (create delivery request)
- [x] GET /api/orders/:orderNumber (lookup order status)
- [x] POST /api/orders/check-zip (validate ZIP code and get region info)
- [x] GET /api/admin/orders (get all orders for admin)
- [x] GET /api/admin/drivers (get all drivers)
- [x] PATCH /api/admin/orders/:id/status (update order status)
- [x] POST /api/admin/orders/:id/assign (assign driver to order)

### Customer-Facing Pages
- [x] Home page with hero, staff picks, and features
- [x] Shop page with product grid and filters
- [x] Product detail page with full product info
- [x] Delivery Zones page with service area information
- [x] About Us page with company story and values
- [x] Loyalty/Rewards page with tier system
- [x] Track Order page with order status lookup
- [x] Age gate modal (21+ verification)
- [x] First-Time Customer modal with welcome offer
- [x] Delivery Request modal with ZIP validation

### Admin Dashboard
- [x] Admin dashboard at /admin route
- [x] Order list with filtering by status
- [x] Order statistics (total, new, active, delivered)
- [x] Order detail cards with customer info and items
- [x] Driver assignment dropdown
- [x] Status update controls
- [x] Real-time order management

### Design & UX
- [x] "Valley Sunset Noir" premium dark theme
- [x] Unique strain photography for each product
- [x] Responsive navigation with mobile menu
- [x] Sticky header with scroll effects
- [x] Professional footer with compliance info
- [x] Consistent branding throughout

## Remaining Tasks

### Testing & QA
- [ ] Test complete delivery request flow (customer submits → appears in admin)
- [ ] Test ZIP code validation (valid vs invalid ZIPs)
- [ ] Test order status updates (admin changes status → customer sees update)
- [ ] Test driver assignment workflow
- [ ] Mobile responsiveness testing
- [ ] Cross-browser compatibility

### Nice-to-Have Features
- [ ] Admin login/authentication
- [ ] Product management UI in admin (add/edit/delete products)
- [ ] Driver management UI (add/edit drivers)
- [ ] Email/SMS notifications for order updates
- [ ] PWA manifest for "Add to Home Screen"
- [ ] Order confirmation page after successful submission
- [ ] Customer reviews/ratings system
- [ ] Related products section on product detail page

### Documentation
- [ ] README with setup instructions
- [ ] Environment variables documentation
- [ ] Admin credentials documentation
- [ ] Deployment guide


## New User Request
- [x] Add "Create Manual Order" button to admin dashboard for phone orders
- [x] Build manual order form with product selection, customer info, and ZIP validation
- [x] Connect manual order form to POST /api/orders endpoint
