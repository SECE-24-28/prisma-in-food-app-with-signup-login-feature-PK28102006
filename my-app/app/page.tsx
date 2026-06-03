"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import FoodList from "./components/FoodList";
import Footer from "./components/Footer";
import { FoodItem } from "@/types/food";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const cartMap = new Map<number, number>(JSON.parse(storedCart));
        const count = Array.from(cartMap.values()).reduce((sum, qty) => sum + qty, 0);
        setCartCount(count);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  const handleAddToCart = (item: FoodItem) => {
    try {
      const storedCart = localStorage.getItem("cart");
      let cartMap = new Map<number, number>();
      
      if (storedCart) {
        cartMap = new Map<number, number>(JSON.parse(storedCart));
      }
      
      const currentQty = cartMap.get(item.id) || 0;
      cartMap.set(item.id, currentQty + 1);
      
      // Update count
      const newCount = Array.from(cartMap.values()).reduce((sum, qty) => sum + qty, 0);
      setCartCount(newCount);
      
      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(Array.from(cartMap.entries())));
      alert(`${item.food_name} added to cart!`);
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#fcfcfc"
    }}>
      <Navbar cartCount={cartCount} />
      
      <main style={{ flex: 1, paddingBottom: "2rem" }}>
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #eaeaea",
          marginBottom: "2rem"
        }}>
          <h2 style={{ fontSize: "2rem", color: "#333", margin: "0 0 0.5rem 0" }}>
            Welcome to TastyBites
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#666", margin: 0 }}>
            Order fresh, delicious food delivered straight to your door.
          </p>
        </div>

        <FoodList onAddToCart={handleAddToCart} />
      </main>

      <Footer />
    </div>
  );
}
