"use client";

import React from "react";

export default function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#ffffff",
      borderTop: "1px solid #eaeaea",
      color: "#888",
      fontSize: "0.9rem",
      marginTop: "4rem"
    }}>
      <p>&copy; {new Date().getFullYear()} TastyBites. All rights reserved.</p>
    </footer>
  );
}
