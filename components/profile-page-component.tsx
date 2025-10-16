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
import { ordersGateway } from "../domain/gateways/orders.gateway";

export default function ProfilePageComponent() {
  const [user, setUser] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  const handleAddressAdded = async (newAddress: any) => {
    // Refresh the addresses list
    try {
      const updatedAddresses =
        await userGateway.getSavedAddressForCurrentUser();
      setSavedAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error refreshing addresses:", error);
    }
  };

  const handleAddressDeleted = async (addressId: string) => {
    // Refresh the addresses list after deletion
    try {
      const updatedAddresses =
        await userGateway.getSavedAddressForCurrentUser();
      setSavedAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error refreshing addresses:", error);
    }
  };

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const [userDetails, userOrders, userAddresses] = await Promise.all([
          userGateway.getCurrentUser(),
          ordersGateway.getCurrentUserOrders(),
          userGateway.getSavedAddressForCurrentUser(),
        ]);

        setUser(userDetails);
        setSavedAddresses(userAddresses);
        setOrders(userOrders.data);
        setTotalOrders(userOrders.total);
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
        <ProfileHeader user={user} totalOrders={totalOrders} />

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <ProfileTabs />

          {/* Orders Tab */}
          <OrdersTab orders={orders} />

          {/* Profile Tab */}
          <ProfileTabContent user={user} />

          {/* Addresses Tab */}
          {user && (
            <AddressTab
              savedAddresses={savedAddresses}
              user={user}
              onAddressAdded={handleAddressAdded}
              onAddressDeleted={handleAddressDeleted}
            />
          )}

          {/* Payment Tab */}
          <PaymentTab />

          {/* Wishlist Tab */}
          <WishlistTab />
        </Tabs>
      </div>
    </div>
  );
}
