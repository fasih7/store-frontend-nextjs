"use client";

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Wallet, MapPin, Plus, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { OTPModal } from "../dialogs/opt-modal";
import { OrderDetails, SavedAddress, User } from "@/lib/types";
import { ordersGateway } from "@/domain/gateways/orders.gateway";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { AlertDialog, useAlert } from "../shared/alerts";

interface CheckoutFormProps {
  user?: User | null; // Pass user data from your auth context/hook
  savedAddresses?: SavedAddress[]; // User's saved addresses
}

export default function CheckoutForm({
  user,
  savedAddresses = [],
}: CheckoutFormProps) {
  const { items } = useCart();
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const { alert, hideAlert, showError } = useAlert();
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>("");
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);

  const router = useRouter();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    province: "",
    paymentMethod: "cash",
    zip: "",
  });

  // Pre-fill form with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setOrderDetails((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Handle saved address selection
  useEffect(() => {
    if (selectedSavedAddress && savedAddresses.length > 0) {
      const address = savedAddresses.find(
        (addr) => addr.id === selectedSavedAddress
      );
      if (address) {
        setOrderDetails((prev) => ({
          ...prev,
          address: address.address,
          city: address.city,
          province: address.province,
          zip: address.zip,
        }));
        setShowAddNewAddress(false);
      }
    }
  }, [selectedSavedAddress, savedAddresses]);

  // Timer countdown effect
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const sendOtpForVerification = async () => {
    try {
      await ordersGateway.verifyEmailForOrder(
        orderDetails.email,
        orderDetails.firstName
      );
      setTimer(30);
      return true;
    } catch (error: any) {
      console.error("Email verification failed", error);
      showError("Error!", error.message || "Something went wrong!");
      return false;
    }
  };

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();

    // For logged-in users, skip OTP verification
    if (user) {
      await handleDirectSubmit();
    } else {
      // For guest users, require OTP verification
      const result = await sendOtpForVerification();
      if (result) {
        setIsOtpOpen(true);
      }
    }
  };

  const handleDirectSubmit = async () => {
    const submitParams = {
      ...orderDetails,
      userId: user?.id, // Include user ID for logged-in users
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: +item.price,
      })),
      totalPrice: items.reduce(
        (sum, item) => sum + +item.price * (item.quantity ?? 1),
        0
      ),
    };

    try {
      const orderId = await ordersGateway.submitOrder(submitParams);
      router.push(`/order-success/${orderId}`);
    } catch (error: any) {
      console.error("Order submission failed", error);
      showError("Error!", error.message || "Something went wrong!");
    }
  };

  const handleOtpSubmit = async (otpValue: string) => {
    if (otpValue) {
      const submitParams = {
        ...orderDetails,
        token: otpValue,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        totalPrice: items.reduce(
          (sum, item) => sum + +item.price * (item.quantity ?? 1),
          0
        ),
      };

      try {
        const orderId = await ordersGateway.submitOrder(submitParams);
        setIsOtpOpen(false);
        router.push(`/order-success/${orderId}`);
      } catch (error: any) {
        console.error("Order submission failed", error);
        setErrorMessage(error.message || "Something went wrong!");
      }
    }
  };

  const handleOtpModalChange = (open: boolean) => {
    setIsOtpOpen(open);
    if (!open) {
      setErrorMessage(undefined);
    }
  };

  const handleAddNewAddress = () => {
    setSelectedSavedAddress("");
    setShowAddNewAddress(true);
    // Clear address fields for new input
    setOrderDetails((prev) => ({
      ...prev,
      address: "",
      city: "",
      province: "",
      zip: "",
    }));
  };

  return (
    <div className="col-span-2">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {user && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            <Check className="inline w-4 h-4 mr-2" />
            Logged in as {user.firstName} {user.lastName}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8">
        <form className="space-y-6" onSubmit={handleProceed}>
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                required
                value={orderDetails.firstName}
                onChange={(e) =>
                  setOrderDetails({
                    ...orderDetails,
                    firstName: e.target.value,
                  })
                }
                id="firstName"
                placeholder="Ali"
                disabled={!!user} // Disable for logged-in users
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                required
                value={orderDetails.lastName}
                onChange={(e) =>
                  setOrderDetails({ ...orderDetails, lastName: e.target.value })
                }
                id="lastName"
                placeholder="Ahmad"
                disabled={!!user} // Disable for logged-in users
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              required
              value={orderDetails.email}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, email: e.target.value })
              }
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={!!user} // Disable for logged-in users
            />
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Email verification not required for logged-in users
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              required
              value={orderDetails.phone}
              onChange={(e) =>
                setOrderDetails({ ...orderDetails, phone: e.target.value })
              }
              id="phone"
              type="tel"
              placeholder="03XXXXXXXXX"
            />
          </div>

          {/* Saved Addresses Section for Logged-in Users */}
          {user && savedAddresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedSavedAddress}
                  onValueChange={setSelectedSavedAddress}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a saved address" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        <div className="text-left">
                          <p className="font-medium">{address.label}</p>
                          <p className="text-sm text-gray-500">
                            {address.address}, {address.city},{" "}
                            {address.province}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddNewAddress}
                  className="mt-3 w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Address Fields */}
          {(!user ||
            savedAddresses.length === 0 ||
            showAddNewAddress ||
            !selectedSavedAddress) && (
            <>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  required
                  value={orderDetails.address}
                  onChange={(e) =>
                    setOrderDetails({
                      ...orderDetails,
                      address: e.target.value,
                    })
                  }
                  id="address"
                  rows={3}
                  placeholder="123 Main St, Anytown USA"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    required
                    value={orderDetails.province}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        province: e.target.value,
                      })
                    }
                    id="province"
                    placeholder="Punjab"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    required
                    value={orderDetails.city}
                    onChange={(e) =>
                      setOrderDetails({ ...orderDetails, city: e.target.value })
                    }
                    id="city"
                    placeholder="Lahore"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    required
                    value={orderDetails.zip}
                    onChange={(e) =>
                      setOrderDetails({ ...orderDetails, zip: e.target.value })
                    }
                    id="zip"
                    placeholder="12345"
                  />
                </div>
              </div>
            </>
          )}

          {/* Payment Method */}
          <div>
            <Label htmlFor="paymentType" className="mb-2 block">
              Payment Method
            </Label>
            <RadioGroup
              id="paymentType"
              defaultValue="cash"
              value={orderDetails.paymentMethod}
              onValueChange={(value) => setOrderDetails({ ...orderDetails })}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem id="cash" value="cash" />
                <Label
                  htmlFor="cash"
                  className="flex items-center cursor-pointer"
                >
                  <Wallet className="h-6 w-6 mr-2" />
                  Cash On Delivery
                </Label>
              </div>
              {/* Add more payment methods as needed */}
            </RadioGroup>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {user ? "Place Order" : "Verify Email & Place Order"}
            </Button>
          </div>
        </form>
      </div>

      {/* OTP Modal - Only for guest users */}
      {!user && (
        <OTPModal
          open={isOtpOpen}
          onOpenChange={handleOtpModalChange}
          onOptSubmit={handleOtpSubmit}
          onResendOTP={() => {
            sendOtpForVerification();
          }}
          timer={timer}
          errorMessage={errorMessage}
        />
      )}

      <AlertDialog {...alert} onClose={hideAlert} />
    </div>
  );
}
