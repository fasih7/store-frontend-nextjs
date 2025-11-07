"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Order } from "@/domain/entities/order.entity";
import { getReadableDate } from "@/shared/helpers";

const statusColorMap: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-purple-100 text-purple-800",
  Cancelled: "bg-red-100 text-red-800",
};

export interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
}

const formatPrice = (price: string) => {
  return `Rs. ${parseFloat(price).toLocaleString()}`;
};

const formatOrderId = (id: string) => {
  return `#ORD-${id.slice(0, 8)}`;
};

/**
 * Orders table component
 */
export function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-3 pr-4 font-medium">Order ID</th>
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Total</th>
            <th className="py-3 pr-4 font-medium">Status</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Items</th>
            <th className="py-3 pr-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderTableRow key={order.id} order={order} onViewOrder={onViewOrder} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Individual order row component
 */
function OrderTableRow({
  order,
  onViewOrder,
}: {
  order: Order;
  onViewOrder: (orderId: string) => void;
}) {
  return (
    <tr className="border-b last:border-0 hover:bg-accent/50 transition-colors">
      <td className="py-3 pr-4">
        <span className="font-medium">{formatOrderId(order.id)}</span>
      </td>
      <td className="py-3 pr-4">
        <span>
          {order.firstName} {order.lastName}
        </span>
      </td>
      <td className="py-3 pr-4 font-medium">{formatPrice(order.totalPrice)}</td>
      <td className="py-3 pr-4">
        <Badge
          className={
            statusColorMap[order.status] || "bg-gray-100 text-gray-800"
          }
        >
          {order.status}
        </Badge>
      </td>
      <td className="py-3 pr-4 text-muted-foreground">
        {getReadableDate(new Date(order.createdAt))}
      </td>
      <td className="py-3 pr-4 text-muted-foreground">
        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewOrder(order.id)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </td>
    </tr>
  );
}

