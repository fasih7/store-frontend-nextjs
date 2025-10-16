import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Truck } from "lucide-react";
import { getReadableDate } from "../../shared/helpers";

type CardContentType = {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: string;
  items?: string;
};

const statusColorMap = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-purple-100 text-purple-800",
  Cancelled: "bg-red-100 text-red-800",
};

type OrderStatus = keyof typeof statusColorMap;

export default function OrdersTab({
  orders,
}: {
  orders: Array<CardContentType & { status: OrderStatus }>;
}) {
  const cardContentData = orders.map((order) => ({
    id: `#ORD-${order.id.slice(0, 8)}`,
    date: order.createdAt,
    status: order.status,
    total: `Rs: ${order.totalPrice}`,
    items: order.items,
    statusColor: statusColorMap[order.status],
  }));

  return (
    <TabsContent value="orders" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Track and manage your recent purchases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cardContentData.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.id}</span>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getReadableDate(new Date(order.date))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.total}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 bg-transparent"
                  >
                    <Truck className="w-3 h-3 mr-1" />
                    Track Order
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{order.items}</p>
            </div>
          ))}
        </CardContent>
        <CardContent className="space-y-4">
          {[
            {
              id: "#ORD-2024-001",
              date: "Jan 15, 2024",
              status: "Delivered",
              total: "$129.99",
              // items: "Wireless Headphones, Phone Case",
              statusColor: "bg-green-100 text-green-800",
            },
            {
              id: "#ORD-2024-002",
              date: "Jan 10, 2024",
              status: "In Transit",
              total: "$89.50",
              items: "Bluetooth Speaker",
              statusColor: "bg-blue-100 text-blue-800",
            },
            {
              id: "#ORD-2024-003",
              date: "Jan 5, 2024",
              status: "Processing",
              total: "$199.99",
              items: "Smart Watch, Charging Cable",
              statusColor: "bg-yellow-100 text-yellow-800",
            },
          ].map((order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.id}</span>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.total}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 bg-transparent"
                  >
                    <Truck className="w-3 h-3 mr-1" />
                    Track Order
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{order.items}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
