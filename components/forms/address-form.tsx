"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressData } from "@/lib/validations";
import { SavedAddress } from "@/lib/types";

interface AddressFormProps {
  initialData?: Partial<AddressData>;
  onSubmit: (data: AddressData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  showDefaultCheckbox?: boolean;
}

export default function AddressForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Save Address",
  showDefaultCheckbox = true,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressData>({
    addressLine: initialData.addressLine || "",
    city: initialData.city || "",
    province: initialData.province || "",
    postalCode: initialData.postalCode || "",
    label: initialData.label || "",
    isDefault: initialData.isDefault || false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressData, string>> = {};

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    } else if (formData.addressLine.length < 5) {
      newErrors.addressLine = "Address must be at least 5 characters";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
    } else if (formData.province.length < 2) {
      newErrors.province = "Province must be at least 2 characters";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (formData.postalCode.length < 5) {
      newErrors.postalCode = "Postal code must be at least 5 characters";
    } else if (!/^[0-9A-Za-z\s\-]+$/.test(formData.postalCode)) {
      newErrors.postalCode = "Please enter a valid postal code";
    }

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    } else if (formData.label.length < 2) {
      newErrors.label = "Label must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  const handleInputChange = (
    field: keyof AddressData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="label" className="py-1">
          Label
        </Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => handleInputChange("label", e.target.value)}
          placeholder="e.g., Home, Work, Office"
          className={errors.label ? "border-red-500" : ""}
        />
        {errors.label && (
          <p className="text-sm text-red-500 mt-1">{errors.label}</p>
        )}
      </div>

      <div>
        <Label htmlFor="addressLine" className="pb-1">
          Address
        </Label>
        <Textarea
          id="addressLine"
          value={formData.addressLine}
          onChange={(e) => handleInputChange("addressLine", e.target.value)}
          placeholder="123 Main St, Anytown"
          rows={3}
          className={errors.addressLine ? "border-red-500" : ""}
        />
        {errors.addressLine && (
          <p className="text-sm text-red-500 mt-1">{errors.addressLine}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="pb-1">
            City
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="Lahore"
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <Label htmlFor="province" className="pb-1">
            Province
          </Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
            placeholder="Punjab"
            className={errors.province ? "border-red-500" : ""}
          />
          {errors.province && (
            <p className="text-sm text-red-500 mt-1">{errors.province}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="postalCode" className="pb-1">
          Postal Code
        </Label>
        <Input
          id="postalCode"
          value={formData.postalCode}
          onChange={(e) => handleInputChange("postalCode", e.target.value)}
          placeholder="12345"
          className={errors.postalCode ? "border-red-500" : ""}
        />
        {errors.postalCode && (
          <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
        )}
      </div>

      {showDefaultCheckbox && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) =>
              handleInputChange("isDefault", checked as boolean)
            }
          />
          <Label
            htmlFor="isDefault"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Set as default address
          </Label>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : submitButtonText}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
