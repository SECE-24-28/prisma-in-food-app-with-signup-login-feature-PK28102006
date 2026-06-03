# Prisma Setup Guide - Food Ordering System

This document provides a complete setup guide for Prisma with authentication (signup/login) in the food ordering system.

## Project Overview

This is a **Next.js 16** food ordering application with:

- PostgreSQL database
- User authentication (signup/login/logout)
- Food menu management
- Order management
- JWT token-based sessions

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ running locally or remotely
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

All Prisma dependencies are already in `package.json`:

```bash
npm install
```

Key dependencies:

- `@prisma/client` - Prisma ORM client
- `@prisma/adapter-pg` - PostgreSQL adapter
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `pg` - PostgreSQL driver
- `next` - React framework

### 2. Configure Environment Variables

Create a `.env.local` file in the `my-app` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:Pk@2006.@localhost:5432/food_order"

# PostgreSQL Connection Details (fallback)
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=Pk@2006.
PGDATABASE=food_order

# JWT Secret
JWT_SECRET=tastybites_jwt_secret_key_2026

# Environment
NODE_ENV=development
```

**Important**: Update these values based on your PostgreSQL setup.

### 3. Create PostgreSQL Database

```bash
psql -U postgres -c "CREATE DATABASE food_order;"
```

### 4. Run Database Migrations

The schema is defined in `prisma/schema.prisma`. To sync the database:

```bash
npx prisma migrate deploy
```

Or to create a new migration:

```bash
npx prisma migrate dev --name init
```

### 5. Seed Sample Data (Optional)

To populate the database with sample food items:

```bash
node setup-db.js
```

This runs the seed data defined in `setup-db.js`.

## Database Schema

### Users Table

```
- id: Auto-incrementing integer (Primary Key)
- email: Unique string (username for login)
- password: Hashed password using bcrypt
- name: User's full name
- role: Default "customer" (can be extended for admin)
- createdAt: Timestamp when user registered
- orders: Relationship to Order table
```

### FoodItems Table

```
- id: Auto-incrementing integer
- foodName: Name of the food item
- description: Optional food description
- category: Category (e.g., "Veg", "Non-Veg")
- price: Decimal with 2 decimal places
- imageUrl: Optional image URL
- createdAt: Timestamp when item was added
- orderItems: Relationship to OrderItem table
```

### Orders Table

```
- id: Auto-incrementing integer
- customerName: Delivery customer name
- customerEmail: Delivery customer email
- customerPhone: Delivery phone number
- deliveryAddress: Street address
- deliveryCity: City for delivery
- deliveryZip: Postal code
- totalPrice: Order total
- status: "pending", "processing", "completed", "cancelled"
- createdAt: Order creation timestamp
- userId: Foreign key to User (optional for guest orders)
- items: Relationship to OrderItem table
```

### OrderItems Table

```
- id: Auto-incrementing integer
- orderId: Foreign key to Order (cascade delete)
- foodItemId: Foreign key to FoodItem (set null on delete)
- quantity: Number of items ordered
- price: Price at time of order
```

## Authentication Flow

### Signup

1. User submits name, email, password
2. Check if email already exists (prevent duplicates)
3. Hash password using bcrypt (10 rounds)
4. Create user record in database
5. Return success message

File: `app/actions/auth.ts` - `signUp()` function

### Login

1. User submits email and password
2. Find user by email
3. Verify password using bcrypt comparison
4. Generate JWT token with user data
5. Set secure HTTP-only cookie with token
6. Token expires in 7 days

File: `app/actions/auth.ts` - `login()` function

### Logout

1. Delete auth token cookie
2. Clear user session

File: `app/actions/auth.ts` - `logout()` function

### Get Current User

1. Read auth token from cookie
2. Verify JWT signature
3. Return user data if valid, null if expired/invalid

File: `app/actions/auth.ts` - `getCurrentUser()` function

## Database Connection

The project uses two connection approaches:

### 1. Prisma Client (Recommended for App Logic)

Located in `lib/prisma.ts`:

- Uses PrismaPg adapter with PostgreSQL driver
- Connection pooling for better performance
- Singleton pattern to prevent hot-reload pool leaks

### 2. Direct PostgreSQL Pool (For Scripts)

Located in `lib/db.ts`:

- Direct connection via `pg` package
- Used in `setup-db.js` for seeding

## API Actions (Server Functions)

All server actions are in `app/actions/` directory:

### Authentication (`auth.ts`)

- `signUp(formData)` - Register new user
- `login(formData)` - Authenticate user
- `logout()` - Clear session
- `getCurrentUser()` - Get logged-in user data

### Food (`getFood.ts`)

- Query food items from database

### Orders (`getOrders.ts`, `getOrderById.ts`, `storeOrder.ts`, `updateOrderStatus.ts`)

- Manage orders and order items

## Common Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# View database in GUI
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# View migration history
npx prisma migrate history

# Check migration status
npx prisma migrate status
```

## Troubleshooting

### Database Connection Error

- Verify PostgreSQL is running: `psql -U postgres`
- Check connection string in `.env.local`
- Ensure database `food_order` exists
- Verify credentials (user/password/host/port)

### "PASSWORD authentication failed"

- Update PGPASSWORD in `.env.local` with correct password
- Ensure no special characters need escaping in connection string

### Migration Issues

- Delete `prisma/migrations` folder and run `prisma migrate dev --name init`
- Or use `prisma migrate reset` to reset everything (dev only)

### Prisma Client Not Found

```bash
npx prisma generate
```

### Cold Start Issues

The `lib/prisma.ts` uses connection pooling and singleton pattern to prevent:

- Hot-reload creating multiple Prisma instances
- Connection pool exhaustion in development
- Long cold starts in serverless environments

## Security Best Practices

✅ **Implemented:**

- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies (prevent XSS access)
- Secure cookies in production
- JWT token expiration (7 days)
- User input validation
- CASCADE delete for data integrity

⚠️ **Consider Adding:**

- Rate limiting on auth endpoints
- CSRF protection
- Email verification for signup
- Password reset flow
- Refresh token mechanism
- Two-factor authentication

## Next Steps

1. Run `npm install` to install dependencies
2. Set up `.env.local` with your database credentials
3. Create PostgreSQL database: `CREATE DATABASE food_order;`
4. Run migrations: `npx prisma migrate dev`
5. Seed data: `node setup-db.js`
6. Start dev server: `npm run dev`
7. Test signup at `http://localhost:3000/signup`
8. Test login at `http://localhost:3000/login`

## File Structure

```
my-app/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── lib/
│   ├── db.ts                  # PostgreSQL pool connection
│   ├── prisma.ts              # Prisma Client singleton
│   ├── menuData.ts            # Food menu data
│   └── ...
├── app/
│   ├── actions/
│   │   ├── auth.ts            # Auth functions (signup/login/logout)
│   │   ├── getFood.ts         # Food queries
│   │   ├── getOrders.ts       # Order queries
│   │   ├── storeOrder.ts      # Order creation
│   │   └── ...
│   ├── signup/                # Signup page
│   ├── login/                 # Login page
│   ├── menu/                  # Menu page
│   ├── orders/                # Orders page
│   └── ...
├── .env.local                 # Environment variables
├── .env.example               # Example env file
├── package.json               # Dependencies
└── PRISMA_SETUP.md           # This file
```

---

**Version:** 1.0  
**Last Updated:** June 2026  
**Framework:** Next.js 16 + Prisma 7.8  
**Database:** PostgreSQL 12+
