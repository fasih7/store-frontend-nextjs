"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { categoriesGateway } from "@/domain/gateways/customer/categories.gateway";
import { useToast } from "@/hooks/shared/use-toast";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName?: string;
};

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirmDelete() {
    try {
      setIsLoading(true);
      await categoriesGateway.deleteCategory(categoryId);
      toast({
        title: "Category deleted",
        description: categoryName
          ? `"${categoryName}" has been deleted successfully.`
          : "Category has been deleted successfully.",
        variant: "success",
      });
      router.refresh();
    } catch (e: any) {
      const description =
        e?.body?.message || e?.message || "Failed to delete category";
      toast({
        title: "Delete failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={isLoading}>
          <Trash2 className="mr-1 h-4 w-4" />{" "}
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete category?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            {categoryName ? ` "${categoryName}"` : " this category"}.
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
