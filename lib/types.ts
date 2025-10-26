export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  images?: string[];
  primaryImage: string;
  categoryId: string;
  userId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    image: string;
    slug: string;
    parentCategoryId: string | null;
    createdAt: string;
    updatedAt: string;
  };
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
