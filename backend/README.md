# VenturesRoom Backend (SQLite Edition)

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Run migrations to create the SQLite database and tables:
   ```sh
   npm run migrate
   ```

3. (Optional) Seed the database with test data:
   ```sh
   node src/utils/seed-data.js
   ```

4. Start the backend server:
   ```sh
   npm run dev
   ```

## Notes
- The backend now uses SQLite (file: `venturesroom.sqlite`) for local development.
- No need to install or run PostgreSQL.
- All data is stored in a single file and is suitable for development and testing.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Startups
- `GET /api/startups` - Get all approved startups
- `GET /api/startups/:id` - Get startup by ID
- `GET /api/startups/my/profile` - Get my startup profile
- `POST /api/startups` - Create startup profile
- `PUT /api/startups/my/profile` - Update startup profile
- `GET /api/startups/my/kpis` - Get startup KPIs

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/my/list` - Get my products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get my orders

### Admin (Admin only)
- `GET /api/admin/pending-approvals` - Get pending approvals
- `POST /api/admin/startups/:id/approve` - Approve/reject startup
- `POST /api/admin/structures/:id/approve` - Approve/reject structure
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/approve` - Update user approval

## Database Schema

The database includes the following main tables:
- `users` - User accounts with roles
- `startups` - Startup profiles
- `structures` - Support structure profiles  
- `products` - Products from startups
- `orders` - Customer orders
- `startup_structure_links` - Relationships between startups and structures
- `commissions` - Commission tracking
- `vip_club_discounts` - VIP member discounts

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
