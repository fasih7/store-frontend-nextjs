"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/admin/use-categories";
import { useProducts } from "@/hooks/admin/use-products";
import { useDebounce } from "@/hooks/shared/use-debounce";
import type { FilterValues } from "@/components/admin/filter-bar/types";
import AddProductModal from "./AddProductModal";
import FilterBar from "@/components/admin/filter-bar/FilterBar";
import type { FilterConfig } from "@/components/admin/filter-bar/types";
import { ProductsTable } from "./components/ProductsTable";
import { ProductsPagination } from "./components/ProductsPagination";
import { ProductsSearch } from "./components/ProductsSearch";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Products management page component
 * Handles product listing, filtering, searching, and pagination
 */
export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    limit: DEFAULT_PAGE_SIZE.toString(),
  });

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch categories for filter
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Calculate page size from filter values
  const pageSize = useMemo(
    () => parseInt(filterValues.limit || DEFAULT_PAGE_SIZE.toString(), 10),
    [filterValues.limit]
  );

  // Fetch products with filters and pagination
  const {
    products,
    pagination,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts({
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

  // Handle product updates (add, edit, delete)
  const handleProductUpdate = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  // Build filter configuration
  const filterConfig: FilterConfig = useMemo(
    () => ({
      fields: [
        {
          key: "category",
          type: "multiselect",
          label: "Category",
          placeholder: "Select categories",
          options: categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          })),
        },
      ],
      sortByOptions: [
        { label: "Price", value: "price" },
        { label: "Title", value: "title" },
        { label: "Created Date", value: "createdAt" },
        { label: "Quantity", value: "quantity" },
      ],
      resultsPerPageOptions: [10, 20, 50, 100],
      defaultResultsPerPage: DEFAULT_PAGE_SIZE,
    }),
    [categories]
  );

  const isLoading = productsLoading || categoriesLoading;
  const hasError = productsError || categoriesError;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onProductAdded={handleProductUpdate}
      />

      {/* Filter Bar */}
      <FilterBar config={filterConfig} onFilterChange={handleFilterChange} />

      {/* Products List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : hasError ? (
            <ErrorState
              error={productsError || categoriesError}
              onRetry={refetchProducts}
            />
          ) : (
            <>
              <ProductsTable
                products={products}
                onProductUpdate={handleProductUpdate}
              />
              <ProductsPagination
                pagination={pagination}
                loading={productsLoading}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Page header component
 */
function PageHeader({
  searchQuery,
  onSearchChange,
  onProductAdded,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onProductAdded: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Manage your product inventory and listings
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ProductsSearch
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <AddProductModal onProductAdded={onProductAdded} />
      </div>
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
        {error?.message || "An error occurred while loading products"}
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
