"use client";
import { JSX, SVGProps, useEffect, useState } from "react";
import CheckoutForm from "./forms/checkout-form";
import CheckoutSummaryCard from "./cards/checkout-summary";
import { userGateway } from "../domain/gateways/user.gateway";

export default function Checkout() {
  const [user, setUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

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
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-6">
        <CheckoutForm user={user} savedAddresses={savedAddresses} />
        <CheckoutSummaryCard />
      </main>
    </div>
  );
}
