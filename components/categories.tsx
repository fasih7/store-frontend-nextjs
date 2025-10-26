"use client";
import CategoryCard from "./category-card";
import { Category } from "@/lib/types";
import { useState, useEffect } from "react";
import { categoriesGateway } from "@/domain/gateways/categories.gateway";

/**
 * The Categories component displays a list of categories.
 */
function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const allCategories = await categoriesGateway.getManyCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Failed to load Categories", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-950/50">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of premium categories
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="h-1 w-3 bg-primary rounded-full"></div>
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          </div>
        </div>

        {/* Display the categories in a grid. */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
