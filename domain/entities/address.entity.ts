export interface SavedAddress {
  id: string;
  label: string; // e.g., "Home", "Office"
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}





