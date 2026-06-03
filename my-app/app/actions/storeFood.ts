"use server";

import prisma from "@/lib/prisma";
import { FoodItem } from "@/types/food";

export async function storeFood(food: Omit<FoodItem, "id" | "created_at">) {
  try {
    const dbItem = await prisma.foodItem.create({
      data: {
        foodName: food.food_name,
        description: food.description,
        category: food.category,
        price: food.price,
        imageUrl: food.image_url,
      },
    });

    const item: FoodItem = {
      id: dbItem.id,
      food_name: dbItem.foodName,
      description: dbItem.description || "",
      category: dbItem.category,
      price: Number(dbItem.price),
      image_url: dbItem.imageUrl || "",
      created_at: dbItem.createdAt,
    };

    return { success: true, item };
  } catch (error: any) {
    console.error("Error in storeFood action:", error);
    return { success: false, error: error.message || "Failed to store food item" };
  }
}

// Seeding function to initialize the database with standard items if empty
export async function seedFoodItems() {
  try {
    const count = await prisma.foodItem.count();

    if (count === 0) {
      console.log("Seeding database with default food items...");
      const seedItems = [
        {
          foodName: "Margherita Pizza",
          description: "Classic pizza with tomato, mozzarella, and basil",
          price: 8.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Pepperoni Pizza",
          description: "Pizza with pepperoni and melted cheese",
          price: 10.99,
          category: "Non-Veg",
          imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Vegetarian Pizza",
          description: "Pizza with fresh vegetables and cheese",
          price: 9.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Caesar Salad",
          description: "Romaine lettuce, parmesan, croutons, Caesar dressing",
          price: 7.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Greek Salad",
          description: "Tomatoes, cucumbers, olives, feta cheese",
          price: 8.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Classic Beef Burger",
          description: "Beef burger with lettuce, tomato, and onion",
          price: 9.99,
          category: "Non-Veg",
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Chicken Burger",
          description: "Grilled chicken burger with mayo and vegetables",
          price: 8.99,
          category: "Non-Veg",
          imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Veggie Burger",
          description: "Plant-based burger with all the fixings",
          price: 7.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Pasta Carbonara",
          description: "Spaghetti with bacon, egg, and parmesan",
          price: 11.99,
          category: "Non-Veg",
          imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Pasta Marinara",
          description: "Spaghetti with tomato sauce and basil",
          price: 9.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1563379971899-660589a01cc3?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Coke",
          description: "Cold cola beverage",
          price: 2.99,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60"
        },
        {
          foodName: "Iced Tea",
          description: "Refreshing iced tea",
          price: 2.49,
          category: "Veg",
          imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60"
        }
      ];

      await prisma.foodItem.createMany({
        data: seedItems,
      });

      return { success: true, message: "Database seeded successfully" };
    }
    return { success: true, message: "Database already contains records" };
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return { success: false, error: error.message || "Failed to seed database" };
  }
}
