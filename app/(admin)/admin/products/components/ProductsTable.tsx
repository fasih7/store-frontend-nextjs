"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { buildImageUrl } from "@/lib/utils";
import type { Product } from "@/domain/entities/product.entity";
import EditProductModal from "../EditProductModal";
import DeleteProductButton from "../DeleteProductButton";
import type { ProductsTableProps } from "../types";

/**
 * Products table component
 */
export function ProductsTable({ products, onProductUpdate }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12">
        <ImageIcon className="h-4 w-4" />
        <p>No products found.</p>
      </div>
    );
  }

  return (
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
          {products.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onProductUpdate={onProductUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Individual product row component
 */
function ProductTableRow({
  product,
  onProductUpdate,
}: {
  product: Product;
  onProductUpdate: () => void;
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-2 pr-4">
        <ProductImage
          src={product.primaryImage}
          alt={product.title}
        />
      </td>
      <td className="py-2 pr-4 font-medium">{product.title}</td>
      <td className="py-2 pr-4">{product.category?.name || "—"}</td>
      <td className="py-2 pr-4">{product.price}</td>
      <td className="py-2 pr-4">{product.quantity}</td>
      <td className="py-2 pr-4">
        <ProductActions product={product} onProductUpdate={onProductUpdate} />
      </td>
    </tr>
  );
}

/**
 * Product image component with fallback
 */
function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted">
      {src ? (
        <Image
          src={buildImageUrl(src)}
          alt={alt}
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
  );
}

/**
 * Product action buttons component
 */
function ProductActions({
  product,
  onProductUpdate,
}: {
  product: Product;
  onProductUpdate: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <EditProductModal
        product={product}
        onProductUpdated={onProductUpdate}
      />
      <DeleteProductButton
        productId={product.id}
        productTitle={product.title}
        onProductDeleted={onProductUpdate}
      />
    </div>
  );
}

