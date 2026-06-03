import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Ordering System",
  description: "Order food online from our restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
