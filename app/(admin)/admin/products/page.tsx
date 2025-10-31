"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { productGateway } from "@/domain/gateways/customer/products.gateway";
import type {
  Product,
  ProductPaginationResponse,
} from "@/domain/entities/product.entity";
import Image from "next/image";
import { buildImageUrl } from "../../../../lib/utils";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductButton from "./DeleteProductButton";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState<
    ProductPaginationResponse["pagination"] | null
  >(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response: ProductPaginationResponse =
          await productGateway.getManyProducts({
            page: currentPage,
            limit: pageSize,
            relations: ["category"],
          });
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentPage, pageSize]);

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleProductUpdate = () => {
    // Refresh products list after update
    async function refreshProducts() {
      try {
        const response: ProductPaginationResponse =
          await productGateway.getManyProducts({
            page: currentPage,
            limit: pageSize,
            relations: ["category"],
          });
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to refresh products:", error);
      }
    }
    refreshProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product inventory and listings
          </p>
        </div>
        <AddProductModal onProductAdded={handleProductUpdate} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <p>No products found.</p>
            </div>
          ) : (
            <>
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
                            <EditProductModal
                              product={p}
                              onProductUpdated={handleProductUpdate}
                            />
                            <DeleteProductButton
                              productId={p.id}
                              productTitle={p.title}
                              onProductDeleted={handleProductUpdate}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing page {pagination.currentPage} of{" "}
                    {pagination.totalPages} ({pagination.totalItems} total
                    products)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!pagination.hasPreviousPage || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
