import ProductCard from "./product-card";
import { Product } from "@/lib/types";

function ProductsSection({
  products,
  heading,
}: Readonly<{ products: Product[]; heading: string }>) {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50/50 to-background dark:from-gray-950/50">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        {/* Enhanced Section heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              {heading}
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-primary to-transparent"></div>
              <div className="h-1 w-2 bg-primary rounded-full"></div>
            </div>
          </div>
          <a
            href="/products"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-all duration-300 group"
          >
            <span>View All</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Grid layout for products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="flex justify-center mt-8 sm:hidden">
          <a
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-all duration-300"
          >
            <span>View All Products</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;

