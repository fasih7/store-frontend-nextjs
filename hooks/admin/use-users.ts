import { useState, useEffect, useCallback } from "react";
import { adminUsersGateway } from "@/domain/gateways/admin/users.gateway";
import type {
  AdminUser,
  UsersPaginationResponse,
} from "@/domain/entities/user.entity";
import type { FilterValues } from "@/components/admin/filter-bar/types";

interface UseUsersParams {
  page: number;
  limit: number;
  filterValues: FilterValues;
  searchQuery: string;
}

interface UseUsersReturn {
  users: AdminUser[];
  pagination: UsersPaginationResponse["pagination"] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage users with pagination and filtering
 */
export function useUsers({
  page,
  limit,
  filterValues,
  searchQuery,
}: UseUsersParams): UseUsersReturn {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] =
    useState<UsersPaginationResponse["pagination"] | null>(null);
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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = buildParams();
      const response: UsersPaginationResponse =
        await adminUsersGateway.getAllUsers(
          params.page,
          params.limit,
          {
            searchQuery: params.searchQuery,
            status: params.status,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          }
        );
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch users")
      );
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    let isMounted = true;

    fetchUsers().then(() => {
      if (!isMounted) {
        return;
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchUsers]);

  return {
    users,
    pagination,
    loading,
    error,
    refetch: fetchUsers,
  };
}

