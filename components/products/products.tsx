"use client";

import { productGateway } from "@/domain/gateways/products.gateway";
import { Category, Product } from "@/lib/types";
import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import FilterSidebar from "../filter-sidebar";
import { getAllCategories } from "@/lib/data";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import { categoriesGateway } from "@/domain/gateways/categories.gateway";

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
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  useEffect(() => {
    async function fetchProducts() {
      console.log("selectedCategories: ", selectedCategories);

      try {
        // Get selected category ids for query
        const selectedCateoryIds = categories
          .filter((category) => selectedCategories.includes(category.name))
          .map((category) => category._id)
          .join(",");

        const allProducts = await productGateway.getManyProducts({
          ...sortOption,
          category: selectedCateoryIds,
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
            <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
              <h1 className="text-3xl font-bold mb-8">All Products</h1>

              {loading ? (
                <p>Loading products...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
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
