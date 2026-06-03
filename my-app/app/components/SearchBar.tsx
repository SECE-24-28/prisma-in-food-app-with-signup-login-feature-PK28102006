"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex",
      gap: "0.5rem",
      flex: 1
    }}>
      <input
        type="text"
        placeholder="Search food by name or description..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
          flex: 1
        }}
      />
      <button type="submit" style={{
        padding: "0.5rem 1.5rem",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "1rem"
      }}>
        Search
      </button>
    </form>
  );
}
