"use server";

import prisma from "@/lib/prisma";
import { FoodItem } from "@/types/food";
import { seedFoodItems } from "./storeFood";

// Global flag to track if we've already seeded to avoid multiple seeding attempts
const globalAny = global as any;
globalAny.foodSeeded = globalAny.foodSeeded || false;

export async function getFood(options?: {
  search?: string;
  category?: string;
  sortBy?: "price_asc" | "price_desc" | "none";
}) {
  try {
    // Only seed once per server session, not on every request
    if (!globalAny.foodSeeded) {
      globalAny.foodSeeded = true;
      await seedFoodItems().catch((err) => {
        console.warn("Seeding failed:", err);
        // Don't throw, continue anyway
      });
    }

    const search = options?.search || "";
    const category = options?.category || "All";
    const sortBy = options?.sortBy || "none";

    const where: any = {};

    if (search.trim() !== "") {
      where.OR = [
        { foodName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category !== "All") {
      where.category = category;
    }

    const orderBy: any = {};
    if (sortBy === "price_asc") {
      orderBy.price = "asc";
    } else if (sortBy === "price_desc") {
      orderBy.price = "desc";
    } else {
      orderBy.id = "asc";
    }

    const dbItems = await prisma.foodItem.findMany({
      where,
      orderBy,
    });

    const items = dbItems.map((item) => ({
      id: item.id,
      food_name: item.foodName,
      description: item.description || "",
      category: item.category,
      price: Number(item.price),
      image_url: item.imageUrl || "",
      created_at: item.createdAt,
    })) as FoodItem[];

    return { success: true, items };
  } catch (error: any) {
    console.error("Error in getFood action:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch food items",
      items: [],
    };
  }
}
