"use client";

import { productGateway } from "@/domain/gateways/customer/products.gateway";
import { Category, Product } from "@/lib/types";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import FilterSidebar from "../filter-sidebar";
import { categoriesGateway } from "@/domain/gateways/customer/categories.gateway";
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
    <div className="py-8 min-h-screen relative">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />

      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:gap-8">
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
          <div className="hidden md:block w-1/4 min-w-[280px]">
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

          <section className="w-full py-8">
            {/* Mobile Search */}
            <div className="md:hidden mb-6">
              <form onSubmit={handleSearch} className="flex w-full gap-2">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pr-10 glass-input border-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="gradient-bg-primary shadow-lg hover:shadow-xl transition-all"
                >
                  <SearchIcon className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Desktop Search with Glass Effect */}
            <div className="hidden md:block mb-8">
              <div className="glass-panel rounded-2xl p-6 border shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <SearchIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold gradient-text-primary">
                    Search Products
                  </h2>
                </div>
                <form onSubmit={handleSearch} className="flex w-full gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="search"
                      placeholder="Search for products, brands, or categories..."
                      className="w-full pr-10 glass-input border-2 focus:border-primary transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="gradient-bg-primary shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                    size="lg"
                  >
                    <SearchIcon className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                  <span className="inline-block h-1 w-1 bg-primary rounded-full" />
                  Press Enter or click search to find products
                </p>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                {displayedSearchQuery ? (
                  <div>
                    <h1 className="text-3xl font-extrabold gradient-text-primary mb-2">
                      Search Results
                    </h1>
                    <p className="text-muted-foreground">
                      Found{" "}
                      <span className="font-semibold text-primary">
                        {products.length}
                      </span>{" "}
                      products matching "{displayedSearchQuery}"
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-extrabold gradient-text-primary mb-2">
                      All Products
                    </h1>
                    <p className="text-muted-foreground">
                      Showing{" "}
                      <span className="font-semibold text-primary">
                        {products.length}
                      </span>{" "}
                      products
                    </p>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-96 rounded-2xl skeleton-loader" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl border shadow-xl">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <SearchIcon className="h-16 w-16 text-primary/50" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {displayedSearchQuery
                        ? "No Results Found"
                        : "No Products Available"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {displayedSearchQuery
                        ? `We couldn't find any products matching "${displayedSearchQuery}"`
                        : "Check back later for new products"}
                    </p>
                    {displayedSearchQuery && (
                      <Button
                        variant="outline"
                        onClick={clearSearch}
                        className="glass-button border-2"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`
                        ${index % 4 === 0 ? "animate-stagger-0" : ""}
                        ${index % 4 === 1 ? "animate-stagger-1" : ""}
                        ${index % 4 === 2 ? "animate-stagger-2" : ""}
                        ${index % 4 === 3 ? "animate-stagger-3" : ""}
                      `}
                    >
                      <ProductCard product={product} />
                    </div>
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

