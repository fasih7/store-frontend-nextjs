"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { adminUsersGateway } from "@/domain/gateways/admin/users.gateway";
import { Status } from "@/domain/entities/user.entity";
import FilterBar from "@/components/admin/filter-bar/FilterBar";
import type {
  FilterConfig,
  FilterValues,
} from "@/components/admin/filter-bar/types";
import { useDebounce } from "@/hooks/shared/use-debounce";
import { useUsers } from "@/hooks/admin/use-users";
import {
  UsersTable,
  UsersPagination,
  UsersSearch,
} from "./components";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Users management page component
 * Handles user listing, filtering, searching, and pagination
 */
export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    limit: DEFAULT_PAGE_SIZE.toString(),
  });
  const [userStatuses, setUserStatuses] = useState<Record<string, Status>>({});
  const [originalStatuses, setOriginalStatuses] = useState<
    Record<string, Status>
  >({});
  const [saving, setSaving] = useState(false);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Calculate page size from filter values
  const pageSize = useMemo(
    () => parseInt(filterValues.limit || DEFAULT_PAGE_SIZE.toString(), 10),
    [filterValues.limit]
  );

  // Fetch users with filters and pagination
  const {
    users,
    pagination,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers({
    page: currentPage,
    limit: pageSize,
    filterValues,
    searchQuery: debouncedSearchQuery,
  });

  // Initialize statuses when users change
  useEffect(() => {
    const statusMap: Record<string, Status> = {};
    const originalStatusMap: Record<string, Status> = {};
    users.forEach((user) => {
      statusMap[user.id] = user.status as Status;
      originalStatusMap[user.id] = user.status as Status;
    });
    setUserStatuses(statusMap);
    setOriginalStatuses(originalStatusMap);
  }, [users]);

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

  // Status management
  const handleStatusChange = useCallback((userId: string, newStatus: Status) => {
    setUserStatuses((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    return Object.keys(userStatuses).some(
      (userId) => userStatuses[userId] !== originalStatuses[userId]
    );
  }, [userStatuses, originalStatuses]);

  const handleSave = useCallback(async () => {
    const changedUsers = Object.keys(userStatuses).filter(
      (userId) => userStatuses[userId] !== originalStatuses[userId]
    );

    if (changedUsers.length === 0) return;

    try {
      setSaving(true);
      await Promise.all(
        changedUsers.map((userId) =>
          adminUsersGateway.updateUserStatus(userId, userStatuses[userId])
        )
      );

      // Update original statuses
      setOriginalStatuses({ ...userStatuses });

      // Refresh the users list
      await refetchUsers();
    } catch (error) {
      console.error("Failed to update user statuses:", error);
      alert("Failed to update user statuses. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [userStatuses, originalStatuses, refetchUsers]);

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
            { label: "Active", value: Status.active },
            { label: "Pending", value: Status.pending },
            { label: "Blocked", value: Status.blocked },
            { label: "Guest", value: Status.guest },
          ],
        },
      ],
      sortByOptions: [
        { label: "Created Date", value: "createdAt" },
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
      ],
      resultsPerPageOptions: [10, 20, 50, 100],
      defaultResultsPerPage: DEFAULT_PAGE_SIZE,
    }),
    []
  );

  const isLoading = usersLoading;
  const hasError = usersError;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        saving={saving}
      />

      {/* Filter Bar */}
      <FilterBar config={filterConfig} onFilterChange={handleFilterChange} />

      {/* Users List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : hasError ? (
            <ErrorState error={usersError} onRetry={refetchUsers} />
          ) : (
            <>
              <UsersTable
                users={users}
                userStatuses={userStatuses}
                onStatusChange={handleStatusChange}
              />
              <UsersPagination
                pagination={pagination}
                loading={usersLoading}
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
  hasUnsavedChanges,
  onSave,
  saving,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage customer accounts and information
        </p>
      </div>
      <div className="flex items-center gap-3">
        <UsersSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
        {hasUnsavedChanges && (
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
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
        {error?.message || "An error occurred while loading users"}
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
