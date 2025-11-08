"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UsersSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

/**
 * Search input component for users
 */
export function UsersSearch({ searchQuery, onSearchChange }: UsersSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64 pl-9"
      />
    </div>
  );
}
