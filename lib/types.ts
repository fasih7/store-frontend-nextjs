export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  primaryImage: string;
  category: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  paymentMethod: "cash";
  zip: string;
  saveAddress?: boolean;
  addressLabel?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface SavedAddress {
  id: string;
  label: string; // e.g., "Home", "Office"
  addressLine: string;
  city: string;
  province: string;
  postalCode: string; // Changed from zip to match backend schema
  isDefault?: boolean;
}
