"use server";

import prisma from "@/lib/prisma";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const id = parseInt(orderId);
    if (isNaN(id)) {
      return { success: false, error: "Invalid Order ID format" };
    }

    const row = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return { success: true, order: row };
  } catch (error: any) {
    console.error("Error updating order status in database:", error);
    return { success: false, error: error.message || "Failed to update order status" };
  }
}
