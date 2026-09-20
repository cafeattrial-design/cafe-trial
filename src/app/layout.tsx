import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pure Veg Cafe SaaS",
  description: "Multi-tenant scan-to-order and POS platform for pure-veg cafes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
