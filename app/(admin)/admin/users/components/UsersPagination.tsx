"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UsersPaginationResponse } from "@/domain/entities/user.entity";

export type UsersPagination = UsersPaginationResponse["pagination"];

export interface UsersPaginationProps {
  pagination: UsersPagination | null;
  loading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

/**
 * Pagination controls component for users
 */
export function UsersPagination({
  pagination,
  loading,
  onPreviousPage,
  onNextPage,
}: UsersPaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing page {pagination.currentPage} of {pagination.totalPages} (
        {pagination.totalItems} total users)
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

