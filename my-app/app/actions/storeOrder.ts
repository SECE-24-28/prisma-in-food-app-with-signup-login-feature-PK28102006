"use server";

import prisma from "@/lib/prisma";
import { CartItem } from "@/lib/menuData";

interface StoreOrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_zip: string;
  total_price: number;
  status: string;
  userId?: number;
}

export async function storeOrder(order: StoreOrderInput, items: CartItem[]) {
  try {
    // Run inside a database transaction using Prisma
    const dbResult = await prisma.$transaction(async (tx) => {
      // Create the Order
      const newOrder = await tx.order.create({
        data: {
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          deliveryAddress: order.delivery_address,
          deliveryCity: order.delivery_city,
          deliveryZip: order.delivery_zip,
          totalPrice: order.total_price,
          status: order.status,
          userId: order.userId || null,
        },
      });

      // Create all OrderItems
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            foodItemId: item.id,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: dbResult.id };
  } catch (error: any) {
    console.error("Error storing order in database:", error);
    return { success: false, error: error.message || "Failed to store order in database", orderId: null };
  }
}
