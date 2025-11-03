export type FilterFieldType =
  | "select"
  | "multiselect"
  | "daterange"
  | "custom";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  type: FilterFieldType;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: string | string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  fields: FilterField[];
  sortByOptions: SortOption[];
  defaultSortBy?: string;
  defaultSortOrder?: 1 | -1; // 1 for ascending, -1 for descending
  resultsPerPageOptions?: number[];
  defaultResultsPerPage?: number;
}

export interface FilterValues {
  [key: string]: string | string[] | undefined;
  sortBy?: string;
  sortOrder?: "1" | "-1";
  limit?: string;
  page?: string;
}



