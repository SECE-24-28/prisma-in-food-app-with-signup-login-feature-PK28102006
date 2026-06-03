"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(formData);
      if (res.success) {
        alert(`Welcome back, ${res.user?.name}!`);
        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "Failed to log in");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          border: "1px solid #eaeaea",
          borderRadius: "8px",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333", margin: "0 0 0.25rem 0" }}>
            TastyBites
          </h1>
          <p style={{ color: "#666", fontSize: "0.95rem" }}>
            Sign in to order your favorite meals
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #eaeaea", marginBottom: "1.5rem" }} />

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "#fff5f5",
              border: "1px solid #fecaca",
              color: "#e53e3e",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
              marginBottom: "1.25rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#333" }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                padding: "0.65rem 0.85rem",
                border: "1px solid #eaeaea",
                borderRadius: "6px",
                fontSize: "0.95rem",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
              onBlur={(e) => (e.target.style.borderColor = "#eaeaea")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label htmlFor="password" style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#333" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                padding: "0.65rem 0.85rem",
                border: "1px solid #eaeaea",
                borderRadius: "6px",
                fontSize: "0.95rem",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
              onBlur={(e) => (e.target.style.borderColor = "#eaeaea")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.25rem",
              padding: "0.7rem",
              backgroundColor: "#ff4e50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.95rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <hr style={{ border: "none", borderTop: "1px solid #eaeaea", margin: "1.5rem 0" }} />

        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
