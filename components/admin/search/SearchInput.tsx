"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Generic search input component
 * Can be used across all admin pages for consistent search UI
 */
export function SearchInput({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  className = "w-64 pl-9",
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={className}
      />
    </div>
  );
}

