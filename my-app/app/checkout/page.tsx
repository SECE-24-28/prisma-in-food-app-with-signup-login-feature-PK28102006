"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { menuItems, CartItem, Order } from "@/lib/menuData";
import { useRouter } from "next/navigation";
import { storeOrder } from "@/app/actions/storeOrder";
import { getCurrentUser } from "@/app/actions/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartMap = new Map<number, number>(JSON.parse(storedCart));
      const items: CartItem[] = [];
      cartMap.forEach((quantity, itemId) => {
        const menuItem = menuItems.find((item) => item.id === itemId);
        if (menuItem) {
          items.push({ ...menuItem, quantity });
        }
      });
      setCartItems(items);
      const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      setTotal(totalPrice);
    } else {
      router.push("/cart");
    }
  }, [router]);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserId(currentUser.id);
        setFormData((prev) => ({
          ...prev,
          name: currentUser.name,
          email: currentUser.email,
        }));
      }
    }
    loadUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Save order details to PostgreSQL database (id is generated automatically)
    const dbResult = await storeOrder({
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      delivery_city: formData.city,
      delivery_zip: formData.zipCode,
      total_price: total,
      status: "pending",
      userId: userId,
    }, cartItems);

    if (!dbResult.success || !dbResult.orderId) {
      alert(`Database error: ${dbResult.error}`);
      return;
    }

    const generatedId = String(dbResult.orderId);

    const order: Order = {
      id: generatedId,
      items: cartItems,
      total,
      status: "pending",
      date: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    router.push(`/orders/${order.id}`);
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
            <Link href="/orders" style={{ textDecoration: "none", color: "#666" }}>Orders</Link>
          </nav>
        </div>

        <hr style={{ height: "1px", backgroundColor: "#eaeaea", border: "none", marginBottom: "2rem" }} />

        <h2 style={{ textAlign: "left", marginBottom: "1.5rem" }}>Checkout</h2>

        {/* TWO-COLUMN LAYOUT */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {/* COLUMN 1: ORDER SUMMARY */}
          <div style={{
            flex: "1 1 450px",
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            padding: "1.5rem"
          }}>
            <h3 style={{
              margin: "0 0 1rem 0",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid #eee"
            }}>Order Summary</h3>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Item</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Qty</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.5rem" }}><strong>{item.name}</strong></td>
                    <td style={{ padding: "0.5rem" }}>{item.quantity}</td>
                    <td style={{ padding: "0.5rem" }}>${item.price.toFixed(2)}</td>
                    <td style={{ padding: "0.5rem" }}><strong>${(item.price * item.quantity).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr style={{ height: "1px", backgroundColor: "#eee", border: "none", marginBottom: "1rem" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>Total Amount:</strong>
              <span style={{ color: "#0070f3", fontSize: "1.25rem", fontWeight: "bold" }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* COLUMN 2: DELIVERY FORM */}
          <div style={{
            flex: "1 1 450px",
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            padding: "1.5rem"
          }}>
            <h3 style={{
              margin: "0 0 1rem 0",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid #eee"
            }}>Delivery Information</h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontWeight: "bold" }}>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontWeight: "bold" }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontWeight: "bold" }}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontWeight: "bold" }}>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontWeight: "bold" }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <label style={{ fontWeight: "bold" }}>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              <button type="submit" style={{
                marginTop: "1rem",
                padding: "0.75rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem"
              }}>
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
