"use client";
import { JSX, SVGProps, useEffect, useState } from "react";
import CheckoutForm from "./forms/checkout-form";
import CheckoutSummaryCard from "./cards/checkout-summary";
import { userGateway } from "@/domain/gateways/customer/user.gateway";
import { useCart } from "@/hooks/customer/use-cart";
import { Button } from "./ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { items } = useCart();

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const [result, savedAddresses] = await Promise.all([
          userGateway.getCurrentUser(),
          userGateway.getSavedAddressForCurrentUser(),
        ]);

        console.log({ result, savedAddresses });
        setUser(result);
        setSavedAddresses(savedAddresses);
      } catch (error: any) {
        console.log("simple error: ", error);
        const parsedError = JSON.parse(error.message);
        console.log("parsedError: ", parsedError);

        if (parsedError?.statusCode === 401) {
          console.log("yes unauthorized");
        }
        console.log(error);
      }
    }

    fetchCurrentUser();
  }, []);

  // Check if cart is empty
  const isCartEmpty = items.length === 0;

  // If cart is empty, show empty cart message
  if (isCartEmpty) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1 container mx-auto flex items-center justify-center py-12 px-6">
          <div className="text-center space-y-8 max-w-lg animate-in fade-in duration-500">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-200/50">
              <ShoppingCart className="w-16 h-16 text-white" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Your cart is empty
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to proceed with checkout.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link href="/products">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-200/50 transition-all duration-300 transform hover:scale-105">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-6 animate-in fade-in duration-500">
        <CheckoutForm user={user} savedAddresses={savedAddresses} />
        <CheckoutSummaryCard />
      </main>
    </div>
  );
}
