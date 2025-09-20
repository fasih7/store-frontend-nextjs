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
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        {/* Display the categories in a grid. */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
