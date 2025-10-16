"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressData } from "@/lib/validations";
import { SavedAddress } from "@/lib/types";
import { userGateway } from "@/domain/gateways/user.gateway";
import AddressForm from "@/components/forms/address-form";
import { useAlert } from "@/components/shared/alerts";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressSaved?: (address: SavedAddress) => void;
  initialData?: Partial<AddressData & { id?: string }>;
  title?: string;
  description?: string;
  flow: "add" | "edit";
}

export default function AddressModal({
  open,
  onOpenChange,
  onAddressSaved,
  initialData,
  title = "Add New Address",
  description = "Enter the details for your new address",
  flow,
}: AddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useAlert();

  const handleSubmit = async (data: AddressData, flow: "add" | "edit") => {
    setIsLoading(true);
    console.log("flow: ", flow);
    try {
      const response =
        flow === "add"
          ? await userGateway.saveAddressForCurrentUser(data)
          : await userGateway.updateAddressForCurrentUser({
              ...data,
              id: initialData?.id,
            } as SavedAddress);

      // Call the callback with the saved address
      if (onAddressSaved) {
        onAddressSaved(response);
      }

      showSuccess("Success!", "Address saved successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving address:", error);
      showError("Error!", error.message || "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AddressForm
          initialData={initialData}
          onSubmit={(data) => handleSubmit(data, flow)}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitButtonText="Save Address"
          showDefaultCheckbox={true}
        />
      </DialogContent>
    </Dialog>
  );
}
