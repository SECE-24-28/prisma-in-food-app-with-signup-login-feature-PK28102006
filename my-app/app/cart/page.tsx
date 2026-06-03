"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { menuItems, CartItem } from "@/lib/menuData";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
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
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    );
    setCartItems(updatedItems);

    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setTotal(newTotal);

    const cartMap = new Map<number, number>(
      updatedItems.map((item) => [item.id, item.quantity]),
    );
    localStorage.setItem("cart", JSON.stringify(Array.from(cartMap.entries())));
  };

  const removeItem = (itemId: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);

    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setTotal(newTotal);

    const cartMap = new Map<number, number>(
      updatedItems.map((item) => [item.id, item.quantity]),
    );
    localStorage.setItem("cart", JSON.stringify(Array.from(cartMap.entries())));
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.removeItem("cart");
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>;
  }

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
            <Link href="/cart" style={{ textDecoration: "none", color: "#0070f3" }}>Cart</Link>
            <Link href="/orders" style={{ textDecoration: "none", color: "#666" }}>Orders</Link>
          </nav>
        </div>

        <hr style={{ height: "1px", backgroundColor: "#eaeaea", border: "none", marginBottom: "2rem" }} />

        {/* MAIN CONTENT */}
        <h2 style={{ textAlign: "left", marginBottom: "1.5rem" }}>Shopping Cart</h2>

        {cartItems.length > 0 ? (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem", border: "1px solid #eaeaea" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "2px solid #eaeaea" }}>
                  <th style={{ textAlign: "left", padding: "12px" }}>Item</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Quantity</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Subtotal</th>
                  <th style={{ textAlign: "left", padding: "12px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}><strong>{item.name}</strong></td>
                    <td style={{ padding: "12px" }}>${item.price.toFixed(2)}</td>
                    <td style={{ padding: "12px" }}>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        style={{ width: "60px", padding: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
                      />
                    </td>
                    <td style={{ padding: "12px", color: "#0070f3" }}>
                      <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#c62828",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <h3>Total: ${total.toFixed(2)}</h3>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={clearCart}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#0070f3",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    display: "inline-block"
                  }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "3rem",
            textAlign: "center"
          }}>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>Your cart is empty</p>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "#0070f3",
                padding: "0.75rem 1.5rem",
                borderRadius: "4px",
                fontWeight: "bold",
                display: "inline-block"
              }}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
