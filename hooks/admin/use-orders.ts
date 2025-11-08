import { useState, useEffect, useCallback } from "react";
import { ordersGateway } from "@/domain/gateways/customer/orders.gateway";
import type {
  Order,
  OrderPaginationResponse,
} from "@/domain/entities/order.entity";
import type { FilterValues } from "@/components/admin/filter-bar/types";

interface UseOrdersParams {
  page: number;
  limit: number;
  filterValues: FilterValues;
  searchQuery: string;
}

interface UseOrdersReturn {
  orders: Order[];
  pagination: OrderPaginationResponse["pagination"] | null;
  total: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage orders with pagination and filtering
 */
export function useOrders({
  page,
  limit,
  filterValues,
  searchQuery,
}: UseOrdersParams): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] =
    useState<OrderPaginationResponse["pagination"] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const buildParams = useCallback(() => {
    const params: {
      page: number;
      limit: number;
      searchQuery?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: number;
    } = {
      page,
      limit,
    };

    if (searchQuery.trim()) {
      params.searchQuery = searchQuery.trim();
    }

    if (
      filterValues.status &&
      Array.isArray(filterValues.status) &&
      filterValues.status.length > 0
    ) {
      params.status = filterValues.status.join(",");
    }

    if (filterValues.sortBy) {
      params.sortBy = filterValues.sortBy;
      if (filterValues.sortOrder) {
        params.sortOrder = parseInt(filterValues.sortOrder, 10);
      }
    }

    return params;
  }, [page, limit, filterValues, searchQuery]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = buildParams();
      const response: OrderPaginationResponse =
        await ordersGateway.getOrdersWithPagination(
          params.page,
          params.limit,
          {
            searchQuery: params.searchQuery,
            status: params.status,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          }
        );
      setOrders(response.data);
      setPagination(response.pagination);
      setTotal(response.total);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch orders")
      );
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    let isMounted = true;

    fetchOrders().then(() => {
      if (!isMounted) {
        return;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchOrders]);

  return {
    orders,
    pagination,
    total,
    loading,
    error,
    refetch: fetchOrders,
  };
}

