"use client";

import React from "react";

interface SortSectionProps {
  sortBy: "price_asc" | "price_desc" | "none";
  onSortChange: (sortBy: "price_asc" | "price_desc" | "none") => void;
}

export default function SortSection({ sortBy, onSortChange }: SortSectionProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label htmlFor="sort-select" style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sort by:</label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as any)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
          backgroundColor: "white",
          cursor: "pointer"
        }}
      >
        <option value="none">Default Ordering</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
