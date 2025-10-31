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

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    description: string;
    quantity: number;
    price: string;
    images?: string[];
    primaryImage: string;
    categoryId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  paymentMethod: string;
  totalPrice: string;
  userId: string;
  guestOrder: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderPaginationResponse {
  data: Order[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}





