import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Online Store - Modern E-commerce Experience",
    template: "%s | Online Store",
  },
  description:
    "Discover premium products at unbeatable prices. Shop electronics, clothing, home decor, and more with fast shipping and secure checkout.",
  keywords: [
    "online store",
    "e-commerce",
    "shopping",
    "electronics",
    "clothing",
    "home decor",
    "furniture",
  ],
  authors: [{ name: "Online Store Team" }],
  creator: "Online Store",
  publisher: "Online Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-store.com",
    siteName: "Online Store",
    title: "Online Store - Modern E-commerce Experience",
    description:
      "Discover premium products at unbeatable prices. Shop electronics, clothing, home decor, and more.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Online Store - Premium Shopping Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Store - Modern E-commerce Experience",
    description:
      "Discover premium products at unbeatable prices. Shop electronics, clothing, home decor, and more.",
    images: ["/images/twitter-image.jpg"],
    creator: "@onlinestore",
  },
  verification: {
    google: "your-google-verification-code",
  },
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
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
