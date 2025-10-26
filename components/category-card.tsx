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
      <Card className="overflow-hidden transition-all hover:shadow-md py-0 gap-0">
        <div className="aspect-square relative">
          {/* <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover"
          /> */}
          <img
            src={buildImageUrl(category.image) || "/placeholder.svg"}
            alt={category.name || "Category"}
            // fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-center">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoryCard;
