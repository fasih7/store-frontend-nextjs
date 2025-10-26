"use client";

import { productGateway } from "@/domain/gateways/products.gateway";
import { Category, Product } from "@/lib/types";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import FilterSidebar from "../filter-sidebar";
import { categoriesGateway } from "@/domain/gateways/categories.gateway";
import { ProductsMobileFilter } from "./mobile-filter";
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, X } from "lucide-react";

const sortMappings: Record<string, any> = {
  priceLowHigh: { sortBy: "price", order: 1 },
  priceHighLow: { sortBy: "price", order: -1 },
  nameAZ: { sortBy: "title", order: 1 },
  nameZA: { sortBy: "title", order: -1 },
  newest: { sortBy: "createdAt", order: -1 },
  sort: {},
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<Record<string, any>>();
  const [sortValue, setSortValue] = useState<string>("sort");
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [displayedSearchQuery, setDisplayedSearchQuery] =
    useState(initialQuery);

  // Initialize selected category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categories.length > 0) {
      const categoryName = decodeURIComponent(categoryFromUrl);
      if (categories.some((cat) => cat.name === categoryName)) {
        setSelectedCategories([categoryName]);
      }
    }
  }, [searchParams, categories]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    const sortConfig = sortMappings[selectedSort];
    if (sortConfig) {
      setSortOption(sortConfig);
      setSortValue(selectedSort);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSortOption({});
    setSortValue("sort");
    setSearchQuery("");
    setDisplayedSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDisplayedSearchQuery("");
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Only search when form is submitted (Enter pressed)
    setDisplayedSearchQuery(searchQuery);
    fetchProductsWithSearch();
  };

  const fetchProductsWithSearch = async () => {
    try {
      setLoading(true);
      // Get selected category ids for query
      const selectedCateoryIds = categories
        .filter((category) => selectedCategories.includes(category.name))
        .map((category) => category.id)
        .join(",");
      console.log({ selectedCateoryIds, searchQuery });

      const allProducts = await productGateway.getManyProducts({
        ...sortOption,
        category: selectedCateoryIds,
        searchQuery: searchQuery.trim() || undefined,
      });
      setProducts(allProducts.data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Get selected category ids for query
        const selectedCateoryIds = categories
          .filter((category) => selectedCategories.includes(category.name))
          .map((category) => category.id)
          .join(",");
        console.log({ selectedCateoryIds, searchQuery });

        const allProducts = await productGateway.getManyProducts({
          ...sortOption,
          category: selectedCateoryIds,
          searchQuery: searchQuery.trim() || undefined,
        });
        setProducts(allProducts.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategories, priceRange, sortOption]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const allCategories = await categoriesGateway.getManyCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-6">
          {/* Mobile Filter Button */}
          <ProductsMobileFilter
            categories={categories}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            sortValue={sortValue}
            handleSortChange={handleSortChange}
            handleCategoryChange={handleCategoryChange}
            handlePriceChange={handlePriceChange}
            clearAllFilters={clearAllFilters}
          />
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-1/4 min-w-[250px]">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              minPrice={1}
              maxPrice={100000}
              sortOption={sortValue}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onPriceChange={handlePriceChange}
              onClearFilters={clearAllFilters}
            />
          </div>

          <section className="w-full py-12">
            <div className="md:hidden">
              <form onSubmit={handleSearch} className="flex w-full mb-6">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="Search products... (Press Enter)"
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={clearSearch}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button type="submit" className="ml-2">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold mb-4">Search Products</h1>
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="Search products... (Press Enter)"
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={clearSearch}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button type="submit" className="ml-2">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                Press Enter or click the search button to search
              </p>
            </div>

            <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
              {displayedSearchQuery ? (
                <h1 className="text-3xl font-bold mb-8">
                  Search Results for: {displayedSearchQuery}
                </h1>
              ) : (
                <h1 className="text-3xl font-bold mb-8">All Products</h1>
              )}

              {loading ? (
                <p>Loading products...</p>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {displayedSearchQuery
                      ? `No products found for "${displayedSearchQuery}"`
                      : "No products available"}
                  </p>
                  {displayedSearchQuery && (
                    <Button
                      variant="outline"
                      onClick={clearSearch}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Products;
