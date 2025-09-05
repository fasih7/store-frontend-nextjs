import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, CreditCard, Heart } from "lucide-react";

export default function ProfileTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
      <TabsTrigger value="orders" className="flex items-center gap-2">
        <Package className="w-4 h-4" />
        Orders
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="w-4 h-4" />
        Profile
      </TabsTrigger>
      <TabsTrigger value="addresses" className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Addresses
      </TabsTrigger>
      <TabsTrigger value="payment" className="flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        Payment
      </TabsTrigger>
      <TabsTrigger value="wishlist" className="flex items-center gap-2">
        <Heart className="w-4 h-4" />
        Wishlist
      </TabsTrigger>
    </TabsList>
  );
}
