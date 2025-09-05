import { productGateway } from "@/domain/gateways/products.gateway";
import { Product } from "@/lib/types";
import { useState, useEffect } from "react";
import ProductsSection from "./product-section";

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await productGateway.getFeaturedProducts();
        setFeaturedProducts(allProducts.products);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);
  return (
    <ProductsSection products={featuredProducts} heading="Featured Products" />
  );
}

export default FeaturedProducts;
