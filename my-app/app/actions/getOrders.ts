"use server";

import prisma from "@/lib/prisma";

export async function getOrders(ids: string[], userId?: number) {
  try {
    const intIds = ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));

    const where: any = {};
    if (userId !== undefined && userId !== null) {
      if (intIds.length > 0) {
        where.OR = [
          { userId: userId },
          { id: { in: intIds } }
        ];
      } else {
        where.userId = userId;
      }
    } else {
      if (intIds.length === 0) {
        return { success: true, orders: [] };
      }
      where.id = { in: intIds };
    }

    const dbOrders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    const orders = dbOrders.map((row) => ({
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
    }));

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error fetching orders from database:", error);
    return { success: false, error: error.message || "Failed to fetch orders from database", orders: [] };
  }
}
