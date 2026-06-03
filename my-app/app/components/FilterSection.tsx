"use client";

import React from "react";

interface FilterSectionProps {
  category: string;
  onFilterChange: (category: string) => void;
}

export default function FilterSection({ category, onFilterChange }: FilterSectionProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label htmlFor="filter-select" style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Category:</label>
      <select
        id="filter-select"
        value={category}
        onChange={(e) => onFilterChange(e.target.value)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
          backgroundColor: "white",
          cursor: "pointer"
        }}
      >
        <option value="All">All Categories</option>
        <option value="Veg">Veg</option>
        <option value="Non-Veg">Non-Veg</option>
      </select>
    </div>
  );
}
