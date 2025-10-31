import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoriesGateway } from "@/domain/gateways/customer/categories.gateway";
import type { Category } from "@/domain/entities/category.entity";
import Image from "next/image";
import { buildImageUrl } from "../../../../lib/utils";
import { Image as ImageIcon } from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryButton from "./DeleteCategoryButton";
import EditCategoryModal from "./EditCategoryModal";

export default async function CategoriesPage() {
  const categoriesResponse = await categoriesGateway.getManyCategories();
  const categories: Category[] =
    categoriesResponse?.data || categoriesResponse || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories and organization
          </p>
        </div>
        <AddCategoryModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <p>No categories found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Image</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Slug</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <div className="h-16 w-16 relative rounded-md overflow-hidden bg-muted">
                          {category.image ? (
                            <Image
                              src={buildImageUrl(category.image)}
                              alt={category.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-4 font-medium">{category.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {category.slug}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <EditCategoryModal category={category} />
                          <DeleteCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
