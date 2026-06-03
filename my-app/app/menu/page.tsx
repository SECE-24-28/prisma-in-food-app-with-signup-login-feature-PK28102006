"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "3rem", fontFamily: "Arial, sans-serif", color: "#666" }}>
      Redirecting to home page...
    </div>
  );
}
