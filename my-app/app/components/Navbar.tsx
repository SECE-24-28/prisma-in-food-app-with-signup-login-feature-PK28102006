"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import CartButton from "./CartButton";
import { getCurrentUser, logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface NavbarProps {
  cartCount: number;
}

export default function Navbar({ cartCount }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    checkUser();
  }, []);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      setUser(null);
      alert("Logged out successfully");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #eaeaea",
      marginBottom: "2rem"
    }}>
      <Link href="/" style={{ textDecoration: "none", color: "#333" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>TastyBites</h1>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontWeight: "bold" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#0070f3" }}>
          Home
        </Link>
        <Link href="/menu" style={{ textDecoration: "none", color: "#666" }}>
          Menu
        </Link>
        <Link href="/cart" style={{ textDecoration: "none", color: "#666" }}>
          Cart{cartCount > 0 ? ` (${cartCount})` : ""}
        </Link>
        <Link href="/orders" style={{ textDecoration: "none", color: "#666" }}>
          Orders
        </Link>

        <span style={{ height: "1.5rem", width: "1px", backgroundColor: "#eaeaea" }} />

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.95rem", color: "#333", fontWeight: "500" }}>
              Hi, {user.name}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                border: "1px solid #ff4e50",
                background: "transparent",
                color: "#ff4e50",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ff4e50";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#ff4e50";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/login" style={{ 
              textDecoration: "none", 
              color: "#666",
              fontSize: "0.95rem"
            }}>
              Login
            </Link>
            <Link href="/signup" style={{ 
              textDecoration: "none", 
              color: "white",
              backgroundColor: "#ff4e50",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              fontSize: "0.95rem"
            }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
