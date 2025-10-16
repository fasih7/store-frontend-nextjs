import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/products/product-card";
import { categoriesGateway } from "@/domain/gateways/categories.gateway";
import { productGateway } from "@/domain/gateways/products.gateway";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  const category = await categoriesGateway.getOneWithSlug(slug);
  if (!category) {
    notFound();
  }

  const products: Product[] = (
    await productGateway.getManyProducts({
      category: category.id,
    })
  ).data;

  return (
    <>
      <Navbar />
      <section className="w-full py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium">
                No products found in this category
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
