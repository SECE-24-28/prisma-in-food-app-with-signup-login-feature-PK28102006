# Quick Start Guide - Prisma Setup

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd my-app
npm install
```

### Step 2: Configure Database Connection

Update `.env.local` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/food_order"
```

### Step 3: Create Database

```bash
psql -U postgres -c "CREATE DATABASE food_order;"
```

### Step 4: Run Migrations

```bash
npx prisma migrate dev --name init
```

### Step 5: Seed Sample Data

```bash
node setup-db.js
```

### Step 6: Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📋 Database Schema Summary

| Table          | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| **Users**      | Store user accounts (email, hashed password, name, role) |
| **FoodItems**  | Store food menu items (name, price, category, image)     |
| **Orders**     | Store customer orders with delivery details              |
| **OrderItems** | Store items within each order (links Order to FoodItem)  |

---

## 🔐 Authentication Features

✅ **Signup** - Create new user account with password hashing  
✅ **Login** - Authenticate with JWT token (7-day expiry)  
✅ **Logout** - Clear session cookie  
✅ **Current User** - Verify token and return user data

---

## 📂 Key Files

| File                   | Purpose                    |
| ---------------------- | -------------------------- |
| `prisma/schema.prisma` | Database schema definition |
| `lib/prisma.ts`        | Prisma Client singleton    |
| `lib/db.ts`            | PostgreSQL connection pool |
| `app/actions/auth.ts`  | Authentication functions   |
| `.env.local`           | Environment variables      |

---

## 🐛 Common Issues & Solutions

| Issue                            | Solution                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ |
| **"Cannot connect to database"** | Ensure PostgreSQL is running and credentials are correct in `.env.local` |
| **"relation does not exist"**    | Run `npx prisma migrate dev` to create tables                            |
| **"authentication failed"**      | Check database password in `.env.local`                                  |
| **Hot reload issues**            | Prisma singleton in `lib/prisma.ts` prevents connection pool leaks       |

---

## 📚 Useful Commands

```bash
# View database in web UI
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

---

## 🔗 Related Documentation

- [Complete Setup Guide](./PRISMA_SETUP.md)
- [Environment Variables](./.env.example)
- [Prisma Schema](./prisma/schema.prisma)
- [Authentication Logic](./app/actions/auth.ts)

---

**Need help?** Check the PRISMA_SETUP.md file for detailed information.
