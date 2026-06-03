"use server";

import prisma from "@/lib/prisma";

export async function getOrderById(id: string) {
  try {
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return { success: false, error: "Invalid Order ID format" };
    }

    const row = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    if (!row) {
      return { success: false, error: "Order not found" };
    }

    const order = {
      id: String(row.id),
      date: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
      total: Number(row.totalPrice),
      status: row.status || "pending",
      items: row.items.map((item) => ({
        id: item.id,
        name: item.foodItem?.foodName || "Unknown Food Item",
        quantity: item.quantity,
        price: Number(item.price),
      })),
      customer_name: row.customerName,
      customer_email: row.customerEmail,
      customer_phone: row.customerPhone,
      delivery_address: row.deliveryAddress,
      delivery_city: row.deliveryCity,
      delivery_zip: row.deliveryZip,
    };

    return { success: true, order };
  } catch (error: any) {
    console.error("Error fetching order by ID from database:", error);
    return { success: false, error: error.message || "Failed to fetch order from database" };
  }
}
