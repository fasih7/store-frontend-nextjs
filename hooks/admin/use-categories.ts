import { useEffect, useState } from "react";
import { categoriesGateway } from "@/domain/gateways/customer/categories.gateway";
import type { Category } from "@/domain/entities/category.entity";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch and manage categories
 */
export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const response = await categoriesGateway.getManyCategories();
        const categoriesList = Array.isArray(response)
          ? response
          : response?.data || [];

        if (isMounted) {
          setCategories(categoriesList);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch categories"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, loading, error };
}


