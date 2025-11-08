"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationInfo {
  currentPage?: number;
  page?: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationProps {
  pagination: PaginationInfo | null;
  loading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  itemName?: string; // e.g., "products", "users", "orders"
}

/**
 * Generic pagination controls component
 * Can be used across all admin pages for consistent pagination UI
 */
export function Pagination({
  pagination,
  loading,
  onPreviousPage,
  onNextPage,
  itemName = "items",
}: PaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const currentPage = pagination.currentPage || pagination.page || 1;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing page {currentPage} of {pagination.totalPages} (
        {pagination.totalItems} total {itemName})
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!pagination.hasPreviousPage || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!pagination.hasNextPage || loading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

