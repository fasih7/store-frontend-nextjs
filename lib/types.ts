export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  primaryImage: string;
  category: string;
  quantity: number;
}

export interface Category {
  _id: string;
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
  address: string;
  city: string;
  province: string;
  zip: string;
  isDefault?: boolean;
}
