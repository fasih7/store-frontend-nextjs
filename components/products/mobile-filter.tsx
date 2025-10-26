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
    <div className="flex md:hidden justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-extrabold gradient-text-primary">
          Products
        </h1>
        <p className="text-sm text-muted-foreground">Browse our collection</p>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="glass-button border-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            size="lg"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] glass-panel border-0 backdrop-blur-3xl"
        >
          <div className="py-6">
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
