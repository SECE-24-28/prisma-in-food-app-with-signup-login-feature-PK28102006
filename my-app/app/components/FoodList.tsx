"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import FilterSection from "./FilterSection";
import SortSection from "./SortSection";
import FoodCard from "./FoodCard";
import { FoodItem } from "@/types/food";
import { getFood } from "@/app/actions/getFood";

interface FoodListProps {
  onAddToCart: (item: FoodItem) => void;
}

export default function FoodList({ onAddToCart }: FoodListProps) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "none">("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch food items when search, category, or sortBy change
  const fetchFood = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFood({ search, category, sortBy });
      if (res.success) {
        setItems(res.items);
      } else {
        setError(res.error || "Failed to load food items");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [search, category, sortBy]);

  return (
    <div style={{ padding: "0 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Search, Filter, Sort Controls */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem",
        backgroundColor: "#f9f9f9",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #eaeaea"
      }}>
        <SearchBar onSearch={(q) => setSearch(q)} />
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <FilterSection category={category} onFilterChange={(cat) => setCategory(cat)} />
          <SortSection sortBy={sortBy} onSortChange={(sort) => setSortBy(sort)} />
        </div>
      </div>

      {/* Grid Layout of Items */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", fontSize: "1.2rem", color: "#666" }}>
          Loading delicious food options...
        </div>
      ) : error ? (
        <div style={{
          textAlign: "center",
          padding: "2rem",
          color: "#c62828",
          backgroundColor: "#ffebee",
          borderRadius: "6px",
          border: "1px solid #ffcdd2"
        }}>
          <strong>Error:</strong> {error}
        </div>
      ) : items.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "4rem",
          color: "#888",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          border: "1px dashed #ccc"
        }}>
          <p style={{ fontSize: "1.2rem", margin: 0 }}>No food items matched your criteria.</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem"
        }}>
          {items.map((item) => (
            <FoodCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
