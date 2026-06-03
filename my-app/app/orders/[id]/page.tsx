"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Order } from "@/lib/menuData";
import { useParams } from "next/navigation";
import { getOrderById } from "@/app/actions/getOrderById";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await getOrderById(orderId);
        if (res.success && res.order) {
          setOrder(res.order as any);
        }
      } catch (e) {
        console.error("Failed to fetch order from database", e);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#b06000";
      case "confirmed":
        return "#0070f3";
      case "preparing":
        return "#c084fc";
      case "ready":
        return "#137333";
      case "delivered":
        return "#137333";
      default:
        return "#333";
    }
  };

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

        {loading ? (
          <div style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "4rem",
            textAlign: "center",
            color: "#666"
          }}>
            Loading order details from database...
          </div>
        ) : order ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2>Order Details</h2>
              <Link href="/orders" style={{ textDecoration: "none", color: "#0070f3", fontWeight: "bold" }}>
                &larr; Back to Orders
              </Link>
            </div>

            <div style={{
              border: "1px solid #eaeaea",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              padding: "1.5rem",
              marginBottom: "2rem"
            }}>
              <div style={{
                backgroundColor: "#f9f9f9",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1.5rem"
              }}>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>Order #{order.id}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", color: "#666" }}>
                  <span><strong>Date:</strong> {new Date(order.date).toLocaleString()}</span>
                  <span>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: getStatusColor(order.status), fontWeight: "bold" }}>
                      {order.status.toUpperCase()}
                    </span>
                  </span>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #eaeaea" }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Item</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Quantity</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Price</th>
                    <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "0.75rem 1rem" }}><strong>{item.name}</strong></td>
                      <td style={{ padding: "0.75rem 1rem" }}>{item.quantity}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#0070f3", fontWeight: "bold" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} style={{ textAlign: "right", padding: "1.5rem 1rem 0.5rem 1rem" }}>
                      <h3 style={{ margin: 0 }}>Total: ${order.total.toFixed(2)}</h3>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              backgroundColor: "#f0fdf4",
              padding: "2rem",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#166534", fontSize: "1.5rem" }}>Order Confirmed</h3>
              <p style={{ margin: 0, color: "#15803d", fontWeight: "bold", fontSize: "1.1rem" }}>
                Your order is confirmed and will be delivered shortly.
              </p>
            </div>
          </div>
        ) : (
          <div style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "2rem",
            textAlign: "center"
          }}>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>Order not found</p>
            <Link href="/orders" style={{
              textDecoration: "none",
              color: "white",
              backgroundColor: "#0070f3",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              fontWeight: "bold",
              display: "inline-block"
            }}>
              Back to Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
