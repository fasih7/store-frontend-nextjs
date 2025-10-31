export enum Status {
  active = 'active',
  pending = 'pending',
  blocked = 'blocked',
  guest = 'guest',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: Status;
  role: string;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
}

export interface UsersPaginationResponse {
  data: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}





