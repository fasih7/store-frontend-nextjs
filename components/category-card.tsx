import { Category } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { buildImageUrl } from "../lib/utils";

interface CategoryCardProps {
  category: Category;
}

/**
 * CategoryCard component displays a category with an image, name, and a link
 * to the category's page.
 *
 * @param {CategoryCardProps} props - Props containing the category details.
 * @returns {JSX.Element} The rendered CategoryCard component.
 */
function CategoryCard({ category }: Readonly<CategoryCardProps>) {
  return (
    <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
      <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/30 py-0 gap-0 bg-white dark:bg-gray-900">
        <div className="aspect-square relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

          {/* Image with zoom effect */}
          <img
            src={buildImageUrl(category.image) || "/placeholder.svg"}
            alt={category.name || "Category"}
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          {/* Hover Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
          </div>

          {/* Category Name on Hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
            <h3 className="font-bold text-white text-lg drop-shadow-lg text-center">
              {category.name}
            </h3>
          </div>
        </div>
        <CardContent className="p-5 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50">
          <h3 className="font-semibold text-center text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore now →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoryCard;

