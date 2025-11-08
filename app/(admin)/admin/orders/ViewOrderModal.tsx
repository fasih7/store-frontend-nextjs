"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersGateway } from "@/domain/gateways/customer/orders.gateway";
import type { Order } from "@/domain/entities/order.entity";
import { buildImageUrl } from "@/lib/utils";
import { getReadableDate } from "@/shared/helpers";
import Image from "next/image";
import { Loader2, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/shared/use-toast";

interface ViewOrderModalProps {
  orderId: string | null;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const statusColorMap: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-purple-100 text-purple-800",
  Cancelled: "bg-red-100 text-red-800",
};

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export default function ViewOrderModal({
  orderId,
  onClose,
  onStatusUpdate,
}: ViewOrderModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        setError(null);
        const orderData = await ordersGateway.getOrderDetailsForAdmin(
          orderId as string
        );
        setOrder(orderData);
        setSelectedStatus(orderData.status);
      } catch (err: any) {
        console.error("Failed to fetch order:", err);
        setError(err?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  const handleSaveStatus = async () => {
    if (!order || selectedStatus === order.status) {
      setIsEditingStatus(false);
      return;
    }

    try {
      setUpdatingStatus(true);
      await ordersGateway.updateOrderStatus(order.id, selectedStatus);
      setOrder({ ...order, status: selectedStatus });
      setIsEditingStatus(false);
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${selectedStatus}`,
      });
      onStatusUpdate?.();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedStatus(order?.status || "");
    setIsEditingStatus(false);
  };

  if (!orderId) return null;

  return (
    <Dialog open={!!orderId} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: "85vw", width: "85vw" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            {order && (
              <div className="flex items-center gap-3">
                {isEditingStatus ? (
                  <>
                    <Select
                      value={selectedStatus}
                      onValueChange={handleStatusChange}
                      disabled={updatingStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={handleSaveStatus}
                      disabled={
                        updatingStatus || selectedStatus === order.status
                      }
                      className="gap-2"
                    >
                      {updatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={updatingStatus}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge className={statusColorMap[order.status] || ""}>
                      {order.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingStatus(true)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Status
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-destructive">
            <p>{error}</p>
          </div>
        )}

        {order && !loading && (
          <div className="space-y-6">
            {/* Order Header - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {getReadableDate(new Date(order.createdAt))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Payment Method:
                      </span>
                      <span className="font-medium capitalize">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Type:</span>
                      <span className="font-medium">
                        {order.guestOrder ? "Guest Order" : "Registered User"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">
                        {order.firstName} {order.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium break-all">
                        {order.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{order.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="text-muted-foreground">{order.address}</p>
                  <p className="text-muted-foreground">
                    {order.city}, {order.province} {order.zip}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items - Better Table Layout */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted shrink-0">
                        {item.product.primaryImage ? (
                          <Image
                            src={buildImageUrl(item.product.primaryImage)}
                            alt={item.product.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base mb-1">
                          {item.product.title}
                        </h4>
                        {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.product.description}
                        </p> */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Quantity:{" "}
                              <span className="font-medium text-foreground">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Unit Price:{" "}
                              <span className="font-medium text-foreground">
                                Rs. {parseFloat(item.price).toLocaleString()}
                              </span>
                            </span>
                          </div>
                          <span className="font-semibold text-base">
                            Rs.{" "}
                            {(
                              parseFloat(item.price) * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      Rs. {parseFloat(order.totalPrice).toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>
                      Rs. {parseFloat(order.totalPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
