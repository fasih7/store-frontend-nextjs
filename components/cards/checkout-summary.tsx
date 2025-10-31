import {
  PackageIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  TruckIcon,
  ShoppingBag,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useCart } from "@/hooks/customer/use-cart";

export default function CheckoutSummaryCard() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalItems = items.length;
  const subtotal = items.reduce(
    (sum, item) => sum + +item.price * (item.quantity ?? 1),
    0
  );
  const shipping = 250;
  const total = subtotal + shipping;

  return (
    <div className="sticky top-6 h-fit">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Order Summary
          </h2>
        </div>

        <div className="space-y-6">
          {/* Items List */}
          <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <PackageIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} x Rs: {+item.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Rs: {+item.price * (item.quantity ?? 1)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                Subtotal
              </span>
              <span className="font-medium">
                Rs: {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                Shipping
              </span>
              <span className="font-medium">Rs: {shipping}</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Total */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Rs: {total.toLocaleString()}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Delivery & Policy Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <TruckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Fast Delivery
                </p>
                <p className="text-xs text-blue-700">
                  Estimated: 3-5 business days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <ReceiptIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Return Policy
                </p>
                <p className="text-xs text-green-700">
                  30-day money-back guarantee
                </p>
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 italic pt-2">
              Terms and conditions applied*
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
