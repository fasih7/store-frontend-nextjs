import {
  PackageIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutSummaryCard() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalItems = items.length;
  const subtotal = items.reduce(
    (sum, item) => sum + +item.price * (item.quantity ?? 1),
    0
  );
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs: {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rs: 250</span>
        </div>
        {/* <div className="flex justify-between">
          <span>Discount</span>
          <span className="text-green-500">-$10.00</span>
        </div> */}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rs: {subtotal + 250}</span>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <PackageIcon className="h-5 w-5 text-gray-500" />
              <span>
                {item.quantity} x {item.title}
              </span>
              <span className="ml-auto">
                Rs: {item.price * (item.quantity ?? 1)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <TruckIcon className="h-5 w-5 text-gray-500" />
          <span>Estimated delivery: 3-5 business days</span>
        </div>
        {/* <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
          <span>Secure checkout with SSL encryption</span>
        </div> */}
        <div className="flex items-center gap-2">
          <ReceiptIcon className="h-5 w-5 text-gray-500" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-1 italic text-gray-500">
          <span>Terms and conditions applied*</span>
        </div>
      </div>
    </div>
  );
}
