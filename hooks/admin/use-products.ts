import { useState, useEffect, useCallback } from "react";
import { productGateway } from "@/domain/gateways/customer/products.gateway";
import type {
  Product,
  ProductPaginationResponse,
} from "@/domain/entities/product.entity";
import type { FilterValues } from "@/components/admin/filter-bar/types";

interface UseProductsParams {
  page: number;
  limit: number;
  filterValues: FilterValues;
  searchQuery: string;
}

interface UseProductsReturn {
  products: Product[];
  pagination: ProductPaginationResponse["pagination"] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage products with pagination and filtering
 */
export function useProducts({
  page,
  limit,
  filterValues,
  searchQuery,
}: UseProductsParams): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] =
    useState<ProductPaginationResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const buildParams = useCallback(() => {
    const params: Record<string, string | number> = {
      page,
      limit,
      relations: "category",
    };

    if (
      filterValues.category &&
      Array.isArray(filterValues.category) &&
      filterValues.category.length > 0
    ) {
      params.category = filterValues.category.join(",");
    }

    if (filterValues.sortBy) {
      params.sortBy = filterValues.sortBy;
      if (filterValues.sortOrder) {
        params.order = parseInt(filterValues.sortOrder, 10);
      }
    }

    if (searchQuery.trim()) {
      params.searchQuery = searchQuery.trim();
    }

    return params;
  }, [page, limit, filterValues, searchQuery]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = buildParams();
      const response: ProductPaginationResponse =
        await productGateway.getManyProducts(params);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch products")
      );
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    let isMounted = true;

    fetchProducts().then(() => {
      if (!isMounted) {
        return;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchProducts]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
  };
}


