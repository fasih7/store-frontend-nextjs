import type { Product } from "@/domain/entities/product.entity";
import type { ProductPaginationResponse } from "@/domain/entities/product.entity";

export type ProductsPagination = ProductPaginationResponse["pagination"];

export interface ProductsTableProps {
  products: Product[];
  onProductUpdate: () => void;
}

export interface ProductsPaginationProps {
  pagination: ProductsPagination | null;
  loading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export interface ProductsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

