import { productGateway } from "@/domain/gateways/customer/products.gateway";
import { Product } from "@/lib/types";
import { useState, useEffect } from "react";
import ProductsSection from "./product-section";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await productGateway.getFeaturedProducts();
        // Handle different response structures
        const products =
          response?.[0]?.products || response?.data || response || [];
        setFeaturedProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error("Failed to load products", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <ProductsSection products={featuredProducts} heading="Featured Products" />
  );
}

export default FeaturedProducts;

