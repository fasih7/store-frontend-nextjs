"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users as UsersIcon,
  Save,
} from "lucide-react";
import { adminUsersGateway } from "@/domain/gateways/admin/users.gateway";
import type {
  AdminUser,
  UsersPaginationResponse,
} from "@/domain/entities/user.entity";
import { Status } from "@/domain/entities/user.entity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColorMap: Record<Status, string> = {
  [Status.active]: "bg-green-100 text-green-800 border-green-200",
  [Status.pending]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [Status.blocked]: "bg-red-100 text-red-800 border-red-200",
  [Status.guest]: "bg-blue-100 text-blue-800 border-blue-200",
};

const getStatusDisplayName = (status: Status): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState<
    UsersPaginationResponse["pagination"] | null
  >(null);
  const [userStatuses, setUserStatuses] = useState<Record<string, Status>>({});
  const [originalStatuses, setOriginalStatuses] = useState<
    Record<string, Status>
  >({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response: UsersPaginationResponse =
          await adminUsersGateway.getAllUsers(currentPage, pageSize);
        setUsers(response.data);
        setPagination(response.pagination);

        // Initialize statuses
        const statusMap: Record<string, Status> = {};
        const originalStatusMap: Record<string, Status> = {};
        response.data.forEach((user) => {
          statusMap[user.id] = user.status as Status;
          originalStatusMap[user.id] = user.status as Status;
        });
        setUserStatuses(statusMap);
        setOriginalStatuses(originalStatusMap);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [currentPage, pageSize]);

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleStatusChange = (userId: string, newStatus: Status) => {
    setUserStatuses((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));
  };

  const hasUnsavedChanges = () => {
    return Object.keys(userStatuses).some(
      (userId) => userStatuses[userId] !== originalStatuses[userId]
    );
  };

  const handleSave = async () => {
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
      const response: UsersPaginationResponse =
        await adminUsersGateway.getAllUsers(currentPage, pageSize);
      setUsers(response.data);
      setPagination(response.pagination);

      // Reset status maps with new data
      const statusMap: Record<string, Status> = {};
      const originalStatusMap: Record<string, Status> = {};
      response.data.forEach((user) => {
        statusMap[user.id] = user.status as Status;
        originalStatusMap[user.id] = user.status as Status;
      });
      setUserStatuses(statusMap);
      setOriginalStatuses(originalStatusMap);
    } catch (error) {
      console.error("Failed to update user statuses:", error);
      alert("Failed to update user statuses. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage customer accounts and information
          </p>
        </div>
        {hasUnsavedChanges() && (
          <Button onClick={handleSave} disabled={saving}>
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

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <p>No users found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Total Orders</th>
                      <th className="py-2 pr-4">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">
                          {user.firstName} {user.lastName}
                          {user.isGuest && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Guest)
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4">{user.email}</td>
                        <td className="py-2 pr-4">
                          {user.phone || (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2 pr-4 capitalize">{user.role}</td>
                        <td className="py-2 pr-4">
                          <Select
                            value={userStatuses[user.id] || user.status}
                            onValueChange={(value) =>
                              handleStatusChange(user.id, value as Status)
                            }
                          >
                            <SelectTrigger
                              className={`w-[140px] ${
                                statusColorMap[
                                  (userStatuses[user.id] ||
                                    user.status) as Status
                                ]
                              }`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={Status.active}
                                className="focus:bg-green-50"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  {getStatusDisplayName(Status.active)}
                                </span>
                              </SelectItem>
                              <SelectItem
                                value={Status.pending}
                                className="focus:bg-yellow-50"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                  {getStatusDisplayName(Status.pending)}
                                </span>
                              </SelectItem>
                              <SelectItem
                                value={Status.blocked}
                                className="focus:bg-red-50"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                  {getStatusDisplayName(Status.blocked)}
                                </span>
                              </SelectItem>
                              <SelectItem
                                value={Status.guest}
                                className="focus:bg-blue-50"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  {getStatusDisplayName(Status.guest)}
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 pr-4">{user.totalOrders}</td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing page {pagination.currentPage} of{" "}
                    {pagination.totalPages} ({pagination.totalItems} total
                    users)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!pagination.hasPreviousPage || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
