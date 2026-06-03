const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Pk@2006.',
  database: 'food_order',
});

const seedItems = [
  {
    food_name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and basil",
    price: 8.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Pepperoni Pizza",
    description: "Pizza with pepperoni and melted cheese",
    price: 10.99,
    category: "Non-Veg",
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Vegetarian Pizza",
    description: "Pizza with fresh vegetables and cheese",
    price: 9.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons, Caesar dressing",
    price: 7.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Greek Salad",
    description: "Tomatoes, cucumbers, olives, feta cheese",
    price: 8.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Classic Beef Burger",
    description: "Beef burger with lettuce, tomato, and onion",
    price: 9.99,
    category: "Non-Veg",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Chicken Burger",
    description: "Grilled chicken burger with mayo and vegetables",
    price: 8.99,
    category: "Non-Veg",
    image_url: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Veggie Burger",
    description: "Plant-based burger with all the fixings",
    price: 7.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Pasta Carbonara",
    description: "Spaghetti with bacon, egg, and parmesan",
    price: 11.99,
    category: "Non-Veg",
    image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Pasta Marinara",
    description: "Spaghetti with tomato sauce and basil",
    price: 9.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1563379971899-660589a01cc3?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Coke",
    description: "Cold cola beverage",
    price: 2.99,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60"
  },
  {
    food_name: "Iced Tea",
    description: "Refreshing iced tea",
    price: 2.49,
    category: "Veg",
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60"
  }
];

async function run() {
  try {
    console.log("Connecting to PostgreSQL...");
    const client = await pool.connect();
    
    try {
      console.log("Creating table 'FoodItems' if it does not exist...");
      await client.query(`
        CREATE TABLE IF NOT EXISTS "FoodItems" (
          id SERIAL PRIMARY KEY,
          food_name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(50) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          image_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log("Creating indexes for FoodItems...");
      await client.query(`CREATE INDEX IF NOT EXISTS idx_food_name ON "FoodItems" (food_name);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_category ON "FoodItems" (category);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_price ON "FoodItems" (price);`);

      console.log("Dropping old orders tables if they exist...");
      await client.query('DROP TABLE IF EXISTS "OrderItems" CASCADE;');
      await client.query('DROP TABLE IF EXISTS "Orders" CASCADE;');

      console.log("Creating table 'Orders'...");
      await client.query(`
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
      `);

      console.log("Restarting order ID sequence at 1001...");
      await client.query('ALTER SEQUENCE "Orders_id_seq" RESTART WITH 1001;');

      console.log("Creating table 'OrderItems'...");
      await client.query(`
        CREATE TABLE IF NOT EXISTS "OrderItems" (
          id SERIAL PRIMARY KEY,
          order_id INT REFERENCES "Orders"(id) ON DELETE CASCADE,
          food_item_id INT REFERENCES "FoodItems"(id) ON DELETE SET NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL
        );
      `);

      console.log("Creating indexes for Orders...");
      await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON "Orders" (customer_email);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "OrderItems" (order_id);`);
      
      const countRes = await client.query('SELECT COUNT(*) FROM "FoodItems"');
      const count = parseInt(countRes.rows[0].count);
      console.log(`Current record count in 'FoodItems': ${count}`);
      
      if (count === 0) {
        console.log("Seeding initial food items...");
        for (const item of seedItems) {
          await client.query(`
            INSERT INTO "FoodItems" (food_name, description, category, price, image_url)
            VALUES ($1, $2, $3, $4, $5);
          `, [item.food_name, item.description, item.category, item.price, item.image_url]);
        }
        console.log("Database seeded successfully!");
      } else {
        console.log("Database table already has records. Skipping seeding.");
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database connection or execution error:", err);
  } finally {
    await pool.end();
  }
}

run();
