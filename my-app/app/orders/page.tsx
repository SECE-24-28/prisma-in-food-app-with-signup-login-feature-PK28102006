"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Order } from "@/lib/menuData";
import { getOrders } from "@/app/actions/getOrders";
import { getCurrentUser } from "@/app/actions/auth";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const currentUser = await getCurrentUser();
        const storedOrders = localStorage.getItem("orders");
        let ids: string[] = [];
        if (storedOrders) {
          const localOrders = JSON.parse(storedOrders);
          ids = localOrders.map((o: any) => String(o.id));
        }

        const res = await getOrders(ids, currentUser?.id);
        if (res.success && res.orders) {
          setOrders(res.orders as any[]);
        }
      } catch (e) {
        console.error("Failed to load orders from database", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <h1>Food Ordering System</h1>
          <nav style={{ display: "flex", gap: "1.5rem", fontWeight: "bold" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#666" }}>Home</Link>
            <Link href="/menu" style={{ textDecoration: "none", color: "#666" }}>Menu</Link>
            <Link href="/cart" style={{ textDecoration: "none", color: "#666" }}>Cart</Link>
            <Link href="/orders" style={{ textDecoration: "none", color: "#0070f3" }}>Orders</Link>
          </nav>
        </div>

        <hr style={{ height: "1px", backgroundColor: "#eaeaea", border: "none", marginBottom: "2rem" }} />

        {/* MAIN CONTENT */}
        <h2 style={{ textAlign: "left", marginBottom: "1rem" }}>My Orders</h2>

        {loading ? (
          <div style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "3rem",
            textAlign: "center",
            color: "#666"
          }}>
            Loading your orders from the database...
          </div>
        ) : orders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                border: "1px solid #eaeaea",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                padding: "1.5rem"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                  padding: "0.75rem 1rem",
                  borderRadius: "6px",
                  marginBottom: "1rem"
                }}>
                  <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                  <span style={{ color: "#333", fontWeight: "bold" }}>
                    {(order.status || "pending").toUpperCase()}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#666",
                  marginBottom: "1rem"
                }}>
                  <div>
                    <strong>Date:</strong> {new Date(order.date).toLocaleString()}
                  </div>
                  <div>
                    <strong>Total:</strong> <span style={{ color: "#0070f3", fontWeight: "bold" }}>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <hr style={{ height: "1px", backgroundColor: "#eee", border: "none", marginBottom: "1rem" }} />

                <h4 style={{ marginBottom: "0.5rem" }}>Items:</h4>
                <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
                  {order.items.map((item) => (
                    <li key={item.id} style={{ marginBottom: "0.25rem" }}>
                      {item.name} &nbsp; x {item.quantity} &nbsp;–&nbsp; <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>

                <div style={{ textAlign: "right" }}>
                  <Link href={`/orders/${order.id}`} style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#0070f3",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    display: "inline-block"
                  }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "2rem",
            textAlign: "center"
          }}>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>No orders yet</p>
            <Link href="/" style={{
              textDecoration: "none",
              color: "white",
              backgroundColor: "#0070f3",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              fontWeight: "bold",
              display: "inline-block"
            }}>
              Start Ordering
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
