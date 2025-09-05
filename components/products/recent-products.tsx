import { productGateway } from "@/domain/gateways/products.gateway";
import { Product } from "@/lib/types";
import { useState, useEffect } from "react";
import ProductsSection from "./product-section";

function RecentProducts() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await productGateway.getRecentlyAddedProducts();
        setRecentProducts(allProducts);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);
  return (
    <ProductsSection
      products={recentProducts}
      heading="Recently Added Products"
    />
  );
}

export default RecentProducts;
