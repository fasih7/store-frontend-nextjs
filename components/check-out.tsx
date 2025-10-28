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
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto flex items-center justify-center py-12 px-6">
          <div className="text-center space-y-6 max-w-md">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Your cart is empty
              </h1>
              <p className="text-gray-600">
                Looks like you haven't added any items to your cart yet. Start
                shopping to proceed with checkout.
              </p>
            </div>

            <div className="space-y-4">
              <Link href="/products">
                <Button className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full">
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-6">
        <CheckoutForm user={user} savedAddresses={savedAddresses} />
        <CheckoutSummaryCard />
      </main>
    </div>
  );
}
