import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Online store",
  description: "A Next.js clean ecommerce app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
