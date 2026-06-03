"use client";

import React from "react";
import { FoodItem } from "@/types/food";

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const isVeg = item.category === "Veg";

  return (
    <div style={{
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      padding: "1rem",
      backgroundColor: "#ffffff",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
      justifyContent: "space-between"
    }}>
      <div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: "bold", color: "#333" }}>{item.food_name}</h3>
          <span style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
            fontWeight: "bold",
            color: isVeg ? "#2e7d32" : "#c62828",
            backgroundColor: isVeg ? "#e8f5e9" : "#ffebee"
          }}>
            {isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>

        <p style={{
          fontSize: "0.875rem",
          color: "#666",
          margin: "0.5rem 0 0 0",
          lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          height: "40px"
        }}>
          {item.description}
        </p>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "0.5rem",
        borderTop: "1px solid #f5f5f5",
        paddingTop: "0.75rem"
      }}>
        <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0070f3" }}>
          ${item.price.toFixed(2)}
        </span>
        <button
          onClick={() => onAddToCart(item)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0051b3")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
