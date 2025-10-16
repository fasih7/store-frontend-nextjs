import { productGateway } from "@/domain/gateways/products.gateway";
import { Product } from "@/lib/types";
import { useState, useEffect } from "react";
import ProductsSection from "./product-section";

function BestSellingProducts() {
  const [BestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts = await productGateway.getManyProducts({ limit: 4 });
        console.log("bestSelling: ", allProducts.data);
        setBestSellingProducts(allProducts.data);
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
      products={BestSellingProducts}
      heading="Best Selling Products"
    />
  );
}

export default BestSellingProducts;
