"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import GuestOrderSuccess from "@/components/guest-order-success";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestOrderSuccessPage() {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get order data from sessionStorage
    const storedOrderData = sessionStorage.getItem("guestOrderData");

    if (!storedOrderData) {
      // If no order data, redirect to home
      router.push("/");
      return;
    }

    try {
      const parsedData = JSON.parse(storedOrderData);
      setOrderData(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing order data:", error);
      router.push("/");
    }
  }, [router]);

  // Handle page unload/refresh - clear data when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("guestOrderData");
    };

    const handleRouteChange = () => {
      sessionStorage.removeItem("guestOrderData");
    };

    // Clear data when user navigates away or refreshes
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listen for route changes (Next.js router events)
    const handlePopState = () => {
      sessionStorage.removeItem("guestOrderData");
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Show loading while checking for order data
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {orderData ? (
        <GuestOrderSuccess orderData={orderData} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">
            Order data not found. Please try again.
          </p>
        </div>
      )}
      <Footer />
    </>
  );
}
