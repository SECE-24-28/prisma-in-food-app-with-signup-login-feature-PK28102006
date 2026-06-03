-- Food Ordering System Schema Creation Script
-- Database: PostgreSQL
-- Table: FoodItems

-- -------------------------------------------------------------
-- ER DIAGRAM EXPLANATION
-- -------------------------------------------------------------
-- In a simple Food Ordering System, the primary entity is a "FoodItem".
--
-- ENTITY RELATIONSHIP MODEL:
--
-- +-----------------------------------------------------------+
-- |                         FoodItems                         |
-- +-----------------------------------------------------------+
-- | [PK] id          : SERIAL (Primary Key, Auto-increment)   |
-- |      food_name   : VARCHAR(255) (Not Null)                |
-- |      description : TEXT                                   |
-- |      category    : VARCHAR(50) (Not Null, e.g. Veg)      |
-- |      price       : DECIMAL(10, 2) (Not Null)              |
-- |      image_url   : TEXT                                   |
-- |      created_at  : TIMESTAMP (Default CURRENT_TIMESTAMP)  |
-- +-----------------------------------------------------------+
--
-- Relational Properties:
-- 1. `id` acts as the Primary Key (PK) to uniquely identify each food item.
-- 2. `food_name` is indexed for fast name-based text searches.
-- 3. `category` is indexed to optimize category-based filters (Veg / Non-Veg).
-- 4. `price` is indexed to optimize price sort ordering.
-- 5. Standard CRUD operations are supported by Server Actions (storeFood, getFood).
-- -------------------------------------------------------------

-- Create table "FoodItems"
CREATE TABLE IF NOT EXISTS "FoodItems" (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create performance indexes for search, filter, and sorting
CREATE INDEX IF NOT EXISTS idx_food_name ON "FoodItems" (food_name);
CREATE INDEX IF NOT EXISTS idx_category ON "FoodItems" (category);
CREATE INDEX IF NOT EXISTS idx_price ON "FoodItems" (price);

-- Seed Initial Food Items (if table is empty)
-- This is executed automatically by the storeFood action if no records exist.
-- To prevent duplicates, we check table emptiness inside Server Actions, but we document the seeding SQL here.
-- INSERT INTO "FoodItems" (food_name, description, category, price, image_url) VALUES ...

-- -------------------------------------------------------------
-- ORDERS AND ORDER ITEMS ENTITIES
-- -------------------------------------------------------------

DROP TABLE IF EXISTS "OrderItems" CASCADE;
DROP TABLE IF EXISTS "Orders" CASCADE;

-- Create table "Orders"
CREATE TABLE IF NOT EXISTS "Orders" (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100),
    delivery_zip VARCHAR(20),
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Start sequence at 1001 for sequential order number series
ALTER SEQUENCE "Orders_id_seq" RESTART WITH 1001;

-- Create table "OrderItems"
CREATE TABLE IF NOT EXISTS "OrderItems" (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES "Orders"(id) ON DELETE CASCADE,
    food_item_id INT REFERENCES "FoodItems"(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create performance indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON "Orders" (customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "OrderItems" (order_id);


