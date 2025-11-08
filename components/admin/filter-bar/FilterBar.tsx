"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterConfig, FilterValues } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterBarProps {
  config: FilterConfig;
  onFilterChange: (values: FilterValues) => void;
  className?: string;
}

export default function FilterBar({
  config,
  onFilterChange,
  className,
}: FilterBarProps) {
  // Memoize the default limit to prevent unnecessary recalculations
  const defaultLimit = useMemo(
    () =>
      (
        config.defaultResultsPerPage ||
        config.resultsPerPageOptions?.[0] ||
        10
      ).toString(),
    [config.defaultResultsPerPage, config.resultsPerPageOptions]
  );

  const [filterValues, setFilterValues] = useState<FilterValues>({
    limit: defaultLimit,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isInitialized = useRef(false);

  // Initialize field defaults only once on mount
  useEffect(() => {
    if (isInitialized.current) return;

    const initialValues: FilterValues = {
      limit: defaultLimit,
    };

    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialValues[field.key] = field.defaultValue;
      }
    });

    setFilterValues(initialValues);
    isInitialized.current = true;
    // Don't call onFilterChange here - let the parent component handle initial fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const handleFieldChange = (key: string, value: string | string[]) => {
    const newValues = {
      ...filterValues,
      [key]: value,
      page: "1", // Reset to page 1 on filter change
    };
    setFilterValues(newValues);
    onFilterChange(newValues);
  };

  const clearMultiSelect = (key: string) => {
    handleFieldChange(key, []);
  };

  const getSelectedCount = (key: string): number => {
    const value = filterValues[key];
    if (Array.isArray(value)) {
      return value.length;
    }
    return 0;
  };

  const getMultiSelectDisplay = (key: string): string => {
    const value = filterValues[key];
    if (Array.isArray(value) && value.length > 0) {
      const field = config.fields.find((f) => f.key === key);
      if (field?.options) {
        const selectedLabels = value
          .map((v) => field.options?.find((opt) => opt.value === v)?.label)
          .filter(Boolean);
        return selectedLabels.length > 2
          ? `${selectedLabels.slice(0, 2).join(", ")} +${
              selectedLabels.length - 2
            }`
          : selectedLabels.join(", ");
      }
      return `${value.length} selected`;
    }
    const field = config.fields.find((f) => f.key === key);
    return field?.placeholder || "Select options";
  };

  const toggleMultiSelectValue = (key: string, optionValue: string) => {
    const currentValue = filterValues[key];
    const currentArray = Array.isArray(currentValue) ? currentValue : [];
    const newArray = currentArray.includes(optionValue)
      ? currentArray.filter((v) => v !== optionValue)
      : [...currentArray, optionValue];
    handleFieldChange(key, newArray);
  };

  const isMultiSelectSelected = (key: string, optionValue: string): boolean => {
    const value = filterValues[key];
    return Array.isArray(value) && value.includes(optionValue);
  };

  const handleReset = () => {
    const resetValues: FilterValues = {
      limit: defaultLimit,
    };
    setFilterValues(resetValues);
    onFilterChange(resetValues);
  };

  const hasActiveFilters = () => {
    // Check if any filters are active (beyond defaults)
    if (filterValues.sortBy) return true;
    if (filterValues.sortOrder) return true;

    // Check multiselect fields
    for (const field of config.fields) {
      if (field.type === "multiselect") {
        const value = filterValues[field.key];
        if (Array.isArray(value) && value.length > 0) return true;
      } else if (field.type === "select") {
        const value = filterValues[field.key];
        if (value && value !== field.defaultValue) return true;
      }
    }

    return false;
  };

  const FilterContent = () => (
    <>
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Field Filters */}
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          {config.fields.map((field) => {
            if (field.type === "multiselect") {
              const selectedCount = getSelectedCount(field.key);
              return (
                <DropdownMenu key={field.key} modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto justify-between min-w-[200px]"
                    >
                      <span className="truncate">
                        {getMultiSelectDisplay(field.key)}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[200px] max-h-[300px] overflow-y-auto"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                      // Prevent closing when clicking inside
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("[data-radix-dropdown-menu-content]")
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="p-1">
                      {field.options?.map((option) => {
                        const isSelected = isMultiSelectSelected(
                          field.key,
                          option.value
                        );
                        return (
                          <div
                            key={option.value}
                            className="flex items-center space-x-3 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer"
                            onClick={() =>
                              toggleMultiSelectValue(field.key, option.value)
                            }
                          >
                            <Checkbox
                              id={`${field.key}-${option.value}`}
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleMultiSelectValue(field.key, option.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Label
                              htmlFor={`${field.key}-${option.value}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {option.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                    {selectedCount > 0 && (
                      <div className="p-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-8 text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearMultiSelect(field.key);
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear ({selectedCount})
                        </Button>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            } else if (field.type === "select") {
              const fieldValue = filterValues[field.key];
              const defaultValue =
                typeof field.defaultValue === "string"
                  ? field.defaultValue
                  : "";
              const selectValue =
                typeof fieldValue === "string" ? fieldValue : defaultValue;
              return (
                <Select
                  key={field.key}
                  value={selectValue}
                  onValueChange={(value) => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger className="w-full sm:w-auto min-w-[150px]">
                    <SelectValue
                      placeholder={field.placeholder || field.label}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }
            return null;
          })}
        </div>

        {/* Sort and Results Per Page */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Sort By */}
          <Select
            value={filterValues.sortBy || undefined}
            onValueChange={(value) => handleFieldChange("sortBy", value)}
          >
            <SelectTrigger className="w-full sm:w-auto min-w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {config.sortByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={filterValues.sortOrder || undefined}
            onValueChange={(value) => handleFieldChange("sortOrder", value)}
          >
            <SelectTrigger className="w-full sm:w-auto min-w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Descending</SelectItem>
              <SelectItem value="1">Ascending</SelectItem>
            </SelectContent>
          </Select>

          {/* Results Per Page */}
          {config.resultsPerPageOptions && (
            <Select
              value={filterValues.limit || "10"}
              onValueChange={(value) => handleFieldChange("limit", value)}
            >
              <SelectTrigger className="w-full sm:w-auto min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.resultsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters() && (
        <div className="flex justify-end pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className={cn("bg-card border rounded-lg overflow-hidden", className)}>
      {/* Mobile Header - Collapsible */}
      <div className="md:hidden">
        <Accordion
          type="single"
          collapsible
          value={isMobileOpen ? "filters" : undefined}
          onValueChange={(value) => setIsMobileOpen(value === "filters")}
        >
          <AccordionItem value="filters" className="border-0">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
                {hasActiveFilters() && (
                  <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Active
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 px-4 pb-4">
                <FilterContent />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop View - Always Visible */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-3 p-4">
          <FilterContent />
        </div>
      </div>
    </div>
  );
}
