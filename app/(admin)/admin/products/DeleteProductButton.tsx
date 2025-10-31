"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { productGateway } from "@/domain/gateways/customer/products.gateway";

type DeleteProductButtonProps = {
  productId: string;
  productTitle?: string;
  onProductDeleted?: () => void;
};

export default function DeleteProductButton({
  productId,
  productTitle,
  onProductDeleted,
}: DeleteProductButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirmDelete() {
    try {
      setIsLoading(true);
      await productGateway.deleteProduct(productId);
      onProductDeleted?.();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash2 className="mr-1 h-4 w-4" /> {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            {productTitle ? ` "${productTitle}"` : " this product"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={isLoading}>
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


