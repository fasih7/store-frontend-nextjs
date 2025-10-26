"use client";

import { Product } from "@/lib/types";
import { productGateway } from "@/domain/gateways/products.gateway";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buildImageUrl } from "@/lib/utils";

interface SearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (query: string) => void;
}

export default function SearchDropdown({
  query,
  isOpen,
  onClose,
  onNavigate,
}: SearchDropdownProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim() || !isOpen) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Set loading immediately when query changes
    setLoading(true);
    setError(null);

    const searchProducts = async () => {
      try {
        const results = await productGateway.searchProducts(query);
        setProducts(results || []);
      } catch (err) {
        setError("Failed to search products");
        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isOpen]);

  if (!isOpen || !query.trim()) {
    return null;
  }

  const handleProductClick = () => {
    onClose();
  };

  const handleViewAllClick = () => {
    onNavigate(query);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden w-96 min-w-80">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span>Search results for "{query}"</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-3 py-2">
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 text-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No products found for "{query}"
          </div>
        ) : (
          <>
            <div className="py-2">
              {products.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={handleProductClick}
                >
                  <div className="px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0">
                    <div className="flex gap-3">
                      <div className="relative h-14 w-14 flex-shrink-0">
                        <Image
                          src={buildImageUrl(product.primaryImage)}
                          alt={product.title}
                          fill
                          className="object-cover rounded-md"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-primary">
                            Rs.{product.price}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {product.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {products.length > 5 && (
              <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAllClick}
                  className="w-full text-gray-700 hover:bg-gray-100"
                >
                  View all {products.length} results
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
