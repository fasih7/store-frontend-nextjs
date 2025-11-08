"use client";

import { Users as UsersIcon } from "lucide-react";
import type { AdminUser } from "@/domain/entities/user.entity";
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

export interface UsersTableProps {
  users: AdminUser[];
  userStatuses: Record<string, Status>;
  onStatusChange: (userId: string, newStatus: Status) => void;
}

/**
 * Users table component
 */
export function UsersTable({
  users,
  userStatuses,
  onStatusChange,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12">
        <UsersIcon className="h-4 w-4" />
        <p>No users found.</p>
      </div>
    );
  }

  return (
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
            <UserTableRow
              key={user.id}
              user={user}
              currentStatus={userStatuses[user.id] || user.status}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Individual user row component
 */
function UserTableRow({
  user,
  currentStatus,
  onStatusChange,
}: {
  user: AdminUser;
  currentStatus: Status;
  onStatusChange: (userId: string, newStatus: Status) => void;
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-2 pr-4 font-medium">
        {user.firstName} {user.lastName}
        {user.isGuest && (
          <span className="ml-2 text-xs text-muted-foreground">(Guest)</span>
        )}
      </td>
      <td className="py-2 pr-4">{user.email}</td>
      <td className="py-2 pr-4">
        {user.phone || <span className="text-muted-foreground">—</span>}
      </td>
      <td className="py-2 pr-4 capitalize">{user.role}</td>
      <td className="py-2 pr-4">
        <Select
          value={currentStatus}
          onValueChange={(value) => onStatusChange(user.id, value as Status)}
        >
          <SelectTrigger
            className={`w-[140px] ${statusColorMap[currentStatus]}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Status.active} className="focus:bg-green-50">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {getStatusDisplayName(Status.active)}
              </span>
            </SelectItem>
            <SelectItem value={Status.pending} className="focus:bg-yellow-50">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                {getStatusDisplayName(Status.pending)}
              </span>
            </SelectItem>
            <SelectItem value={Status.blocked} className="focus:bg-red-50">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {getStatusDisplayName(Status.blocked)}
              </span>
            </SelectItem>
            <SelectItem value={Status.guest} className="focus:bg-blue-50">
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
  );
}

