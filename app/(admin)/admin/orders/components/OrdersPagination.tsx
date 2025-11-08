"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OrderPaginationResponse } from "@/domain/entities/order.entity";

export type OrdersPagination = OrderPaginationResponse["pagination"];

export interface OrdersPaginationProps {
  pagination: OrdersPagination | null;
  total: number;
  loading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

/**
 * Pagination controls component for orders
 */
export function OrdersPagination({
  pagination,
  total,
  loading,
  onPreviousPage,
  onNextPage,
}: OrdersPaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing page {pagination.page} of {pagination.totalPages} ({total}{" "}
        total orders)
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

