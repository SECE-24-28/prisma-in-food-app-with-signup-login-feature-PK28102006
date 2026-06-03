# Prisma Schema Reference & Usage Examples

## Database Schema Overview

```
┌─────────────┐
│   Users     │
├─────────────┤
│ id (PK)     │──┐
│ email       │  │
│ password    │  │
│ name        │  │
│ role        │  │
│ createdAt   │  │
└─────────────┘  │
                 │
                 ├──────────────────┐
                 │                  │
           ┌─────────────┐    ┌────────────┐
           │   Orders    │    │ FoodItems  │
           ├─────────────┤    ├────────────┤
           │ id (PK)     │    │ id (PK)    │
           │ userId (FK) │    │ foodName   │
           │ status      │    │ price      │
           │ totalPrice  │    │ category   │
           │ createdAt   │    │ imageUrl   │
           └─────────────┘    └────────────┘
                 │                  │
                 └─────────┬────────┘
                           │
                    ┌──────────────┐
                    │  OrderItems  │
                    ├──────────────┤
                    │ id (PK)      │
                    │ orderId (FK) │
                    │ foodItemId(FK)
                    │ quantity     │
                    │ price        │
                    └──────────────┘
```

## Table Details

### Users Table

**Purpose**: Store user accounts for authentication and order tracking.

```sql
CREATE TABLE "Users" (
  id INT PRIMARY KEY DEFAULT autoincrement(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT now()
);
```

**Prisma Model**:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      String   @default("customer")
  createdAt DateTime @default(now()) @map("created_at")
  orders    Order[]
  @@map("Users")
}
```

**Usage Examples**:

```typescript
// Create a new user
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password_here",
    role: "customer",
  },
});

// Find user by email
const user = await prisma.user.findUnique({
  where: { email: "john@example.com" },
});

// Update user
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { role: "admin" },
});

// Get user with all orders
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { orders: true },
});

// Delete user (cascades to orders)
await prisma.user.delete({
  where: { id: 1 },
});
```

---

### FoodItems Table

**Purpose**: Store the food menu items available for ordering.

```sql
CREATE TABLE "FoodItems" (
  id INT PRIMARY KEY DEFAULT autoincrement(),
  food_name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT now()
);
```

**Prisma Model**:

```prisma
model FoodItem {
  id          Int         @id @default(autoincrement())
  foodName    String      @map("food_name")
  description String?
  category    String
  price       Decimal     @db.Decimal(10, 2)
  imageUrl    String?     @map("image_url")
  createdAt   DateTime    @default(now()) @map("created_at")
  orderItems  OrderItem[]
  @@map("FoodItems")
}
```

**Usage Examples**:

```typescript
// Create a food item
const item = await prisma.foodItem.create({
  data: {
    foodName: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and basil",
    category: "Veg",
    price: 8.99,
    imageUrl: "https://...",
  },
});

// Get all food items
const items = await prisma.foodItem.findMany();

// Get items by category
const vegItems = await prisma.foodItem.findMany({
  where: { category: "Veg" },
  orderBy: { price: "asc" },
});

// Search food items
const results = await prisma.foodItem.findMany({
  where: {
    foodName: { contains: "pizza", mode: "insensitive" },
  },
});

// Update food item
const updated = await prisma.foodItem.update({
  where: { id: 1 },
  data: { price: 12.99 },
});

// Get item with all order instances
const item = await prisma.foodItem.findUnique({
  where: { id: 1 },
  include: { orderItems: true },
});
```

---

### Orders Table

**Purpose**: Store customer orders with delivery and billing information.

```sql
CREATE TABLE "Orders" (
  id INT PRIMARY KEY DEFAULT autoincrement(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address VARCHAR(500) NOT NULL,
  delivery_city VARCHAR(100),
  delivery_zip VARCHAR(10),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  user_id INT FOREIGN KEY,
  created_at TIMESTAMP DEFAULT now()
);
```

**Prisma Model**:

```prisma
model Order {
  id              Int         @id @default(autoincrement())
  customerName    String      @map("customer_name")
  customerEmail   String      @map("customer_email")
  customerPhone   String      @map("customer_phone")
  deliveryAddress String      @map("delivery_address")
  deliveryCity    String?     @map("delivery_city")
  deliveryZip     String?     @map("delivery_zip")
  totalPrice      Decimal     @map("total_price") @db.Decimal(10, 2)
  status          String      @default("pending")
  createdAt       DateTime    @default(now()) @map("created_at")
  userId          Int?        @map("user_id")
  user            User?       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           OrderItem[]
  @@map("Orders")
}
```

**Order Statuses**:

- `pending` - Order received, not yet processed
- `processing` - Order being prepared
- `completed` - Order delivered
- `cancelled` - Order cancelled

**Usage Examples**:

```typescript
// Create an order
const order = await prisma.order.create({
  data: {
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1234567890",
    deliveryAddress: "123 Main St",
    deliveryCity: "Springfield",
    deliveryZip: "12345",
    totalPrice: 25.99,
    status: "pending",
    userId: 1,
    items: {
      create: [
        { foodItemId: 1, quantity: 2, price: 8.99 },
        { foodItemId: 2, quantity: 1, price: 7.99 },
      ],
    },
  },
});

// Get all orders for a user
const orders = await prisma.order.findMany({
  where: { userId: 1 },
  include: { items: { include: { foodItem: true } } },
  orderBy: { createdAt: "desc" },
});

// Get order with items
const order = await prisma.order.findUnique({
  where: { id: 1 },
  include: { items: { include: { foodItem: true } }, user: true },
});

// Update order status
const updated = await prisma.order.update({
  where: { id: 1 },
  data: { status: "completed" },
});

// Get recent orders
const recent = await prisma.order.findMany({
  take: 10,
  orderBy: { createdAt: "desc" },
});

// Get pending orders
const pending = await prisma.order.findMany({
  where: { status: "pending" },
  include: { items: { include: { foodItem: true } } },
});

// Delete order (cascades to items)
await prisma.order.delete({
  where: { id: 1 },
});
```

---

### OrderItems Table

**Purpose**: Join table linking Orders to FoodItems with quantity and pricing.

```sql
CREATE TABLE "OrderItems" (
  id INT PRIMARY KEY DEFAULT autoincrement(),
  order_id INT NOT NULL FOREIGN KEY,
  food_item_id INT FOREIGN KEY,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

**Prisma Model**:

```prisma
model OrderItem {
  id         Int       @id @default(autoincrement())
  orderId    Int       @map("order_id")
  order      Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  foodItemId Int?      @map("food_item_id")
  foodItem   FoodItem? @relation(fields: [foodItemId], references: [id], onDelete: SetNull)
  quantity   Int
  price      Decimal   @db.Decimal(10, 2)
  @@map("OrderItems")
}
```

**Usage Examples**:

```typescript
// Get all items in an order
const orderItems = await prisma.orderItem.findMany({
  where: { orderId: 1 },
  include: { foodItem: true },
});

// Calculate order total
const items = await prisma.orderItem.findMany({
  where: { orderId: 1 },
});
const total = items.reduce(
  (sum, item) => sum + parseFloat(item.price.toString()) * item.quantity,
  0,
);

// Get popularity (most ordered items)
const popular = await prisma.orderItem.groupBy({
  by: ["foodItemId"],
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: "desc" } },
  take: 10,
});

// Get items for a user's order
const userOrder = await prisma.order.findUnique({
  where: { id: 1 },
  include: {
    items: {
      include: { foodItem: true },
    },
  },
});
```

---

## Common Queries

### Authentication & User Management

```typescript
// Signup - check if email exists
const exists = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// Login - find user by email
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  select: { id: true, password: true, name: true, email: true, role: true },
});

// Get user profile
const profile = await prisma.user.findUnique({
  where: { id: 1 },
  select: { id: true, name: true, email: true, role: true, createdAt: true },
});
```

### Order Management

```typescript
// Get user's orders with items
const orders = await prisma.order.findMany({
  where: { userId: 1 },
  include: { items: { include: { foodItem: true } } },
  orderBy: { createdAt: "desc" },
});

// Get order details
const order = await prisma.order.findUnique({
  where: { id: 1 },
  include: {
    items: { include: { foodItem: true } },
    user: { select: { name: true, email: true } },
  },
});

// Get pending orders
const pending = await prisma.order.findMany({
  where: { status: "pending" },
  include: { items: { include: { foodItem: true } } },
  orderBy: { createdAt: "asc" },
});
```

### Menu Management

```typescript
// Get all menu items grouped by category
const menu = await prisma.foodItem.findMany({
  orderBy: { category: "asc" },
});

// Get popular items (ordered most)
const popular = await prisma.orderItem.groupBy({
  by: ["foodItemId"],
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: "desc" } },
  take: 5,
});

// Search items
const search = await prisma.foodItem.findMany({
  where: {
    OR: [
      { foodName: { contains: "pizza", mode: "insensitive" } },
      { description: { contains: "pizza", mode: "insensitive" } },
    ],
  },
});
```

---

## Data Integrity & Constraints

| Constraint                        | Details                                               |
| --------------------------------- | ----------------------------------------------------- |
| **User.email UNIQUE**             | Each email can only belong to one user                |
| **Order.userId CASCADE**          | Deleting a user deletes their orders                  |
| **OrderItem.orderId CASCADE**     | Deleting an order deletes its items                   |
| **OrderItem.foodItemId SET NULL** | Deleting a food item sets items to NULL (not deleted) |
| **Price Decimal(10,2)**           | Supports prices up to $9,999,999.99                   |

---

## Performance Tips

✅ Always use `include` to fetch related data in one query  
✅ Use `select` to fetch only needed fields  
✅ Index frequently queried fields (email, userId, status)  
✅ Use pagination with `take` and `skip` for large datasets  
✅ Batch operations with `createMany` instead of loops

Example:

```typescript
// ❌ Slow - N+1 query problem
const orders = await prisma.order.findMany();
for (let order of orders) {
  order.items = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });
}

// ✅ Fast - Single query
const orders = await prisma.order.findMany({
  include: { items: true },
});
```

---

**For more information, see:**

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Query API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Database Modeling](https://www.prisma.io/docs/orm/prisma-schema/data-model)
