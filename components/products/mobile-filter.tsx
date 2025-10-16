"use client";

import FilterSidebar from "../filter-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Category } from "../../lib/types";

export interface MobileFilterProps {
  categories: Category[];
  selectedCategories: string[];
  priceRange: [number, number];
  sortValue: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCategoryChange: (category: string) => void;
  handlePriceChange: (range: [number, number]) => void;
  clearAllFilters: () => void;
}

export function ProductsMobileFilter({
  categories,
  selectedCategories,
  priceRange,
  sortValue,
  handleSortChange,
  handleCategoryChange,
  handlePriceChange,
  clearAllFilters,
}: MobileFilterProps) {
  return (
    <div className="flex md:hidden justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Search Products</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="py-4">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              minPrice={1}
              maxPrice={100000}
              sortOption={sortValue}
              onSortChange={handleSortChange}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onClearFilters={clearAllFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
