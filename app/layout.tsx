import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apple-Style Flip Clock",
  description: "Premium frontend-only flip clock UI"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
