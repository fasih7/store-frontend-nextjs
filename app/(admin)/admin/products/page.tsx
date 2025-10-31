import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { productGateway } from "@/domain/gateways/customer/products.gateway";
import type { Product } from "@/domain/entities/product.entity";
import Image from "next/image";
import Link from "next/link";
import { buildImageUrl } from "../../../../lib/utils";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductButton from "./DeleteProductButton";

export default async function ProductsPage() {
  const productsResponse = await productGateway.getManyProducts({
    limit: 20,
    relations: ["category"],
  });
  const products: Product[] = productsResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product inventory and listings
          </p>
        </div>
        <AddProductModal />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <p>No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Image</th>
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted">
                          {p.primaryImage ? (
                            <Image
                              src={buildImageUrl(p.primaryImage)}
                              alt={p.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 pr-4 font-medium">{p.title}</td>
                      <td className="py-2 pr-4">{p.category?.name}</td>
                      <td className="py-2 pr-4">{p.price}</td>
                      <td className="py-2 pr-4">{p.quantity}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <EditProductModal product={p} />
                          <DeleteProductButton
                            productId={p.id}
                            productTitle={p.title}
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
