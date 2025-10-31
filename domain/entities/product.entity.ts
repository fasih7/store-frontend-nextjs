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

export interface ProductPaginationResponse {
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}





