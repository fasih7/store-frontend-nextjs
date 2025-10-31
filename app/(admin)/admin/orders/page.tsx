"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ordersGateway } from "@/domain/gateways/customer/orders.gateway";
import type {
  Order,
  OrderPaginationResponse,
} from "@/domain/entities/order.entity";
import { getReadableDate } from "@/shared/helpers";
import { Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ViewOrderModal from "./ViewOrderModal";

const statusColorMap: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-purple-100 text-purple-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState<
    OrderPaginationResponse["pagination"] | null
  >(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response: OrderPaginationResponse =
          await ordersGateway.getOrdersWithPagination(currentPage, pageSize);
        setOrders(response.data);
        setPagination(response.pagination);
        setTotalOrders(response.total);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [currentPage, pageSize]);

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleStatusUpdate = () => {
    // Refresh orders list after status update
    async function refreshOrders() {
      try {
        const response: OrderPaginationResponse =
          await ordersGateway.getOrdersWithPagination(currentPage, pageSize);
        setOrders(response.data);
        setPagination(response.pagination);
        setTotalOrders(response.total);
      } catch (error) {
        console.error("Failed to refresh orders:", error);
      }
    }
    refreshOrders();
  };

  const formatPrice = (price: string) => {
    return `Rs. ${parseFloat(price).toLocaleString()}`;
  };

  const formatOrderId = (id: string) => {
    return `#ORD-${id.slice(0, 8)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No orders found.</p>
            </div>
          ) : (
            <>
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
                      <th className="py-3 pr-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b last:border-0 hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <span className="font-medium">
                            {formatOrderId(order.id)}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span>
                            {order.firstName} {order.lastName}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          {formatPrice(order.totalPrice)}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            className={
                              statusColorMap[order.status] ||
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {getReadableDate(new Date(order.createdAt))}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrderId(order.id)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing page {pagination.page} of {pagination.totalPages} (
                    {totalOrders} total orders)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!pagination.hasPreviousPage || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ViewOrderModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
