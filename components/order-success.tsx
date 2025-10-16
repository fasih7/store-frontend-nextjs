import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Package,
  Mail,
  ArrowRight,
  Download,
  Home,
} from "lucide-react";
import Link from "next/link";
import { ordersGateway } from "@/domain/gateways/orders.gateway";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function OrderSuccess({
  orderId,
}: Readonly<{ orderId: string }>) {
  let result = null;
  try {
    result = await ordersGateway.getOrderById(orderId);
    console.log({ result });
  } catch (error) {
    console.log({ error });
  }

  if (!result) notFound();

  const isoDate = result?.createdAt;
  const formattedDate = format(new Date(isoDate), "dd MMM yyyy, hh:mm a");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-6xl mx-auto">
        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Confirmed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Number</p>
                <p className="font-medium">{orderId}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium text-lg">Rs: {result?.totalPrice}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{result?.paymentMethod}</p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}

            <div className="space-y-3">
              <h3 className="font-medium">Items Ordered</h3>
              <div className="space-y-2">
                {result?.items.map(
                  (item: {
                    quantity: number;
                    title: string;
                    price: number;
                    id: string;
                  }) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        Rs: {item.quantity * item.price}
                      </p>
                    </div>
                  )
                )}
                <Separator />
                {/* <div className="flex justify-between items-center py-2 font-medium">
                  <p>Subtotal</p>
                  <p>$119.97</p>
                </div>
                <div className="flex justify-between items-center py-1 text-sm">
                  <p className="text-gray-600">Shipping</p>
                  <p>$10.02</p>
                </div> */}
                <div className="flex justify-between items-center py-2 font-bold text-lg">
                  <p>Total</p>
                  <p>Rs: {result?.totalPrice}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Shipping Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    {result.firstName} {result.lastName}
                  </p>
                  <p>{result.address}</p>
                  {/* <p>Apartment 4B</p> */}
                  <p>{result.city}</p>
                  <p>{result.province}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Delivery Details</h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">January 10-12, 2025</p>
                  <p className="text-gray-600 mt-2">Shipping Method</p>
                  <p className="font-medium">Standard Shipping</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5" />
              What's Next?
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Order Confirmation Email</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to {result?.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Shipping Updates</p>
                <p className="text-sm text-gray-600">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium">Delivery Notification</p>
                <p className="text-sm text-gray-600">
                  We'll notify you when your package is delivered
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link href="/orders">
              <Package className="w-4 h-4" />
              Track Your Order
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          {/* <Button
            variant="outline"
            asChild
            className="flex items-center gap-2 bg-transparent"
          >
            <Link href="/invoice">
              <Download className="w-4 h-4" />
              Download Invoice
            </Link>
          </Button> */}
          <Button
            variant="outline"
            asChild
            className="flex items-center gap-2 bg-transparent"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Support Section */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, our support team is here
            to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
