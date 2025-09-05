"use client";
import ProfileHeader from "@/components/cards/profile-header";
import AddressTab from "@/components/tabs/address-tab";
import OrdersTab from "@/components/tabs/orders-tab";
import PaymentTab from "@/components/tabs/payment-tab";
import ProfileTabContent from "@/components/tabs/profile-tab-content";
import ProfileTabs from "@/components/tabs/profile-tabs";
import WishlistTab from "@/components/tabs/wishlist-tab";
import { Tabs } from "@/components/ui/tabs";
import { userGateway } from "@/domain/gateways/user.gateway";
import { useEffect, useState } from "react";

export default function ProfilePageComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const result = await userGateway.getCurrentUser();
        console.log({ result });
        setUser(result);
      } catch (error: any) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <ProfileTabs />

          {/* Orders Tab */}
          <OrdersTab />

          {/* Profile Tab */}
          <ProfileTabContent user={user} />

          {/* Addresses Tab */}
          <AddressTab />

          {/* Payment Tab */}
          <PaymentTab />

          {/* Wishlist Tab */}
          <WishlistTab />
        </Tabs>
      </div>
    </div>
  );
}
