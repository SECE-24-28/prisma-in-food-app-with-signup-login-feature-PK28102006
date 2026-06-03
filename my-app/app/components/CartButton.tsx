"use client";

import React from "react";
import Link from "next/link";

interface CartButtonProps {
  count: number;
}

export default function CartButton({ count }: CartButtonProps) {
  return (
    <Link href="/cart" style={{
      textDecoration: "none",
      color: "#0070f3",
      fontWeight: "bold",
      border: "1px solid #0070f3",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: "#f0f7ff"
    }}>
      Cart ({count})
    </Link>
  );
}
