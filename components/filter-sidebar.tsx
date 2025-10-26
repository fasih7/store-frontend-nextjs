"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category } from "@/lib/types";
import { Sparkles, X } from "lucide-react";

export interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  sortOption: string;
  onSortChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

function FilterSidebar({
  categories,
  selectedCategories,
  priceRange,
  minPrice,
  maxPrice,
  sortOption,
  onSortChange,
  onCategoryChange,
  onPriceChange,
  onClearFilters,
}: Readonly<FilterSidebarProps>) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > minPrice ||
    priceRange[1] < maxPrice;

  return (
    <div className="sticky top-4 space-y-6 glass-panel rounded-2xl p-6 border shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold gradient-text-primary">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator className="opacity-50" />

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="flex gap-2 flex-wrap">
          {selectedCategories.length > 0 && (
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {selectedCategories.length} categories
            </div>
          )}
          {priceRange[0] > minPrice && (
            <div className="px-3 py-1 bg-accent/10 text-accent-foreground text-xs font-medium rounded-full">
              Min: Rs.{priceRange[0]}
            </div>
          )}
          {priceRange[1] < maxPrice && (
            <div className="px-3 py-1 bg-accent/10 text-accent-foreground text-xs font-medium rounded-full">
              Max: Rs.{priceRange[1]}
            </div>
          )}
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["categories", "price"]}
        className="w-full"
      >
        {/* Sort Section */}
        <div className="mb-4 pb-4 border-b">
          <Label className="text-sm font-semibold mb-3 block text-muted-foreground">
            Sort By
          </Label>
          <select
            value={sortOption}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm font-medium 
                     hover:border-primary/50 focus:border-primary transition-colors 
                     cursor-pointer glass-input"
            onChange={onSortChange}
          >
            <option value="sort">Sort Options</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="nameAZ">Name: A to Z</option>
            <option value="nameZA">Name: Z to A</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Categories Section */}
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="py-4 font-semibold hover:no-underline hover:text-primary transition-colors">
            Categories
            {selectedCategories.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => onCategoryChange(category.name)}
                    className="group-hover:border-primary"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium cursor-pointer flex-1 group-hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Section */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-4 font-semibold hover:no-underline hover:text-primary transition-colors">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-4">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={(value) =>
                  onPriceChange(value as [number, number])
                }
                className="mt-6"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="glass-input rounded-lg px-4 py-2.5 w-full">
                  <Label className="text-xs text-muted-foreground font-medium block mb-1">
                    Min Price
                  </Label>
                  <div className="text-sm font-semibold">
                    Rs. {priceRange[0]}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="glass-input rounded-lg px-4 py-2.5 w-full">
                  <Label className="text-xs text-muted-foreground font-medium block mb-1">
                    Max Price
                  </Label>
                  <div className="text-sm font-semibold text-right">
                    Rs. {priceRange[1]}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full mt-6 font-medium hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

export default FilterSidebar;
