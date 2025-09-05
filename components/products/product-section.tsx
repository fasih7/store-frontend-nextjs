import ProductCard from "./product-card";
import { Product } from "@/lib/types";

function ProductsSection({
  products,
  heading,
}: Readonly<{ products: Product[]; heading: string }>) {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        {/* Section heading */}
        <h2 className="text-2xl font-bold tracking-tight mb-6">{heading}</h2>
        {/* Grid layout for products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            // Render a ProductCard for each product
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;
