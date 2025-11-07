"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import FilterBar from "@/components/admin/filter-bar/FilterBar";
import type {
  FilterConfig,
  FilterValues,
} from "@/components/admin/filter-bar/types";
import { useDebounce } from "@/hooks/shared/use-debounce";
import { useOrders } from "@/hooks/admin/use-orders";
import {
  OrdersTable,
  OrdersPagination,
  OrdersSearch,
} from "./components";
import ViewOrderModal from "./ViewOrderModal";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Orders management page component
 * Handles order listing, filtering, searching, and pagination
 */
export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    limit: DEFAULT_PAGE_SIZE.toString(),
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Calculate page size from filter values
  const pageSize = useMemo(
    () => parseInt(filterValues.limit || DEFAULT_PAGE_SIZE.toString(), 10),
    [filterValues.limit]
  );

  // Fetch orders with filters and pagination
  const {
    orders,
    pagination,
    total,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useOrders({
    page: currentPage,
    limit: pageSize,
    filterValues,
    searchQuery: debouncedSearchQuery,
  });

  // Reset to first page when filters or search change
  const handleFilterChange = useCallback((values: FilterValues) => {
    setFilterValues(values);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  // Navigation handlers
  const handlePreviousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pagination?.hasPreviousPage]);

  const handleNextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination?.hasNextPage]);

  // Handle order status updates
  const handleStatusUpdate = useCallback(() => {
    refetchOrders();
  }, [refetchOrders]);

  // Build filter configuration
  const filterConfig: FilterConfig = useMemo(
    () => ({
      fields: [
        {
          key: "status",
          type: "multiselect",
          label: "Status",
          placeholder: "Select status",
          options: [
            { label: "Pending", value: "Pending" },
            { label: "Confirmed", value: "Confirmed" },
            { label: "Shipped", value: "Shipped" },
            { label: "Delivered", value: "Delivered" },
            { label: "Cancelled", value: "Cancelled" },
          ],
        },
      ],
      sortByOptions: [
        { label: "Created Date", value: "createdAt" },
        { label: "Total Price", value: "totalPrice" },
        { label: "Status", value: "status" },
      ],
      resultsPerPageOptions: [10, 20, 50, 100],
      defaultResultsPerPage: DEFAULT_PAGE_SIZE,
    }),
    []
  );

  const isLoading = ordersLoading;
  const hasError = ordersError;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Filter Bar */}
      <FilterBar config={filterConfig} onFilterChange={handleFilterChange} />

      {/* Orders List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : hasError ? (
            <ErrorState error={ordersError} onRetry={refetchOrders} />
          ) : (
            <>
              <OrdersTable
                orders={orders}
                onViewOrder={setSelectedOrderId}
              />
              <OrdersPagination
                pagination={pagination}
                total={total}
                loading={ordersLoading}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ViewOrderModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

/**
 * Page header component
 */
function PageHeader({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          View and manage customer orders
        </p>
      </div>
      <OrdersSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
    </div>
  );
}

/**
 * Loading state component
 */
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

/**
 * Error state component
 */
function ErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <p className="text-destructive">
        {error?.message || "An error occurred while loading orders"}
      </p>
      <button
        onClick={onRetry}
        className="text-sm text-primary hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
