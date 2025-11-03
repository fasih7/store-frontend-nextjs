"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ProductsSearchProps } from "../types";

/**
 * Search input component for products
 */
export function ProductsSearch({
  searchQuery,
  onSearchChange,
}: ProductsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64 pl-9"
      />
    </div>
  );
}


