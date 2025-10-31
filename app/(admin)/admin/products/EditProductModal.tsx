"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriesGateway } from "@/domain/gateways/customer/categories.gateway";
import { productGateway } from "@/domain/gateways/customer/products.gateway";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/shared/use-toast";
import type { Product } from "@/domain/entities/product.entity";
import { buildImageUrl } from "@/lib/utils";

type Category = { id: string; name: string };

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  price: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Price must be > 0"),
  quantity: z
    .string()
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "Quantity must be >= 0"
    ),
  categoryId: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof schema>;

interface EditProductModalProps {
  product: Product;
  onProductUpdated?: () => void;
}

export default function EditProductModal({ product, onProductUpdated }: EditProductModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing images state
  const [existingPrimaryPath, setExistingPrimaryPath] = useState<string | null>(
    product.primaryImage || null
  );
  const [originalPrimaryPath] = useState<string | null>(
    product.primaryImage || null
  );
  const [primaryRemoved, setPrimaryRemoved] = useState<boolean>(false);
  const [existingGalleryPaths, setExistingGalleryPaths] = useState<string[]>(
    product.images || []
  );
  const [removedPaths, setRemovedPaths] = useState<Set<string>>(new Set());

  // New images state
  const [newPrimaryFile, setNewPrimaryFile] = useState<File | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      categoryId: product.categoryId,
    },
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await categoriesGateway.getManyCategories();
        const items: Category[] = res?.data || res || [];
        if (mounted) setCategories(items);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const resetToProduct = () => {
    reset({
      title: product.title,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      categoryId: product.categoryId,
    });
    setExistingPrimaryPath(product.primaryImage || null);
    setPrimaryRemoved(false);
    setNewPrimaryFile(null);
    setExistingGalleryPaths(product.images || []);
    setRemovedPaths(new Set());
    setNewGalleryFiles([]);
  };

  const onDropGallery = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const combined = [...newGalleryFiles, ...incoming].slice(0, 5);
    setNewGalleryFiles(combined);
  };

  const removeNewGalleryAt = (idx: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleRemoveExisting = (path: string) => {
    setRemovedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const previews = useMemo(() => {
    const primary = newPrimaryFile
      ? { url: URL.createObjectURL(newPrimaryFile), name: newPrimaryFile.name }
      : !primaryRemoved && existingPrimaryPath
      ? { url: buildImageUrl(existingPrimaryPath), name: existingPrimaryPath }
      : null;

    const existing = existingGalleryPaths
      .filter((p) => !removedPaths.has(p))
      .map((p) => ({ url: buildImageUrl(p), name: p, existing: true }));
    const added = newGalleryFiles.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      existing: false,
    }));
    return { primary, gallery: [...existing, ...added] };
  }, [
    existingPrimaryPath,
    newPrimaryFile,
    existingGalleryPaths,
    removedPaths,
    newGalleryFiles,
    primaryRemoved,
  ]);

  const onSubmit = async (values: FormValues) => {
    // Allow submitting without a primary image; backend may accept null

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", values.title);
      form.append("description", values.description);
      form.append("price", values.price);
      form.append("quantity", values.quantity);
      form.append("category", values.categoryId);

      // Determine removals: primary (if replaced or explicitly removed) + gallery removals
      const removalPaths: string[] = [];
      if (newPrimaryFile && originalPrimaryPath) {
        removalPaths.push(originalPrimaryPath);
      } else if (primaryRemoved && originalPrimaryPath) {
        removalPaths.push(originalPrimaryPath);
      }
      Array.from(removedPaths).forEach((p) => removalPaths.push(p));

      // Primary: if replaced, send new file
      if (newPrimaryFile) {
        form.append("primaryImage", newPrimaryFile);
      }

      // Append removals
      removalPaths.forEach((path, idx) => {
        form.append(`imagesToRemove[${idx}]`, path);
      });

      // New gallery additions
      newGalleryFiles.forEach((img) => form.append("images", img));

      await productGateway.updateProduct(product.id, form);

      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
        variant: "success",
      });
      setOpen(false);
      onProductUpdated?.();
    } catch (e: any) {
      const description =
        e?.body?.message || e?.message || "Failed to update product";
      toast({ title: "Update failed", description, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          resetToProduct();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product details and images.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Product title" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the product"
                rows={5}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Price (PKR)</label>
                <Input placeholder="35000" {...register("price")} />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input placeholder="10" {...register("quantity")} />
                {errors.quantity && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                defaultValue={product.categoryId}
                onValueChange={(val) =>
                  setValue("categoryId", val, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary Image</label>
              <div
                className={cn(
                  "mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40",
                  !(existingPrimaryPath || newPrimaryFile) &&
                    "text-muted-foreground"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setNewPrimaryFile(file);
                    // Selecting a new file implies replacing old primary
                    setPrimaryRemoved(false);
                  }
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    const f = (input.files && input.files[0]) || null;
                    if (f) {
                      setNewPrimaryFile(f);
                      setPrimaryRemoved(false);
                    }
                  };
                  input.click();
                }}
              >
                {previews.primary ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previews.primary.url}
                      alt={previews.primary.name}
                      className="h-36 w-36 object-cover rounded-md shadow"
                    />
                    {(existingPrimaryPath || newPrimaryFile) && (
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (newPrimaryFile) {
                            // Remove the newly selected file
                            setNewPrimaryFile(null);
                          } else if (existingPrimaryPath) {
                            // Mark existing primary as removed and hide it
                            setPrimaryRemoved(true);
                            setExistingPrimaryPath(null);
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-36">
                    <ImageIcon className="h-6 w-6 mb-2" />
                    <p className="text-sm">Click or drop an image</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Replace to change the primary image. The old one will be removed
                automatically.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Gallery Images</label>
                <Badge variant="secondary">Max 5</Badge>
              </div>
              <div
                className="mt-2 border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/40 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onDropGallery(e.dataTransfer.files);
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.multiple = true;
                  input.onchange = () => onDropGallery(input.files);
                  input.click();
                }}
              >
                <p className="text-sm text-muted-foreground">
                  Click or drop images ({newGalleryFiles.length}/5 added)
                </p>
              </div>

              {(existingGalleryPaths.length > 0 ||
                newGalleryFiles.length > 0) && (
                <ScrollArea className="mt-3 h-40 rounded-md border">
                  <div className="p-3 grid grid-cols-3 gap-3">
                    {existingGalleryPaths
                      .filter((path) => !removedPaths.has(path))
                      .map((path) => (
                        <div key={path} className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={buildImageUrl(path)}
                            alt={path}
                            className="h-24 w-full object-cover rounded-md shadow"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                            onClick={() => toggleRemoveExisting(path)}
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                    {newGalleryFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-24 w-full object-cover rounded-md shadow"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                          onClick={() => removeNewGalleryAt(idx)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
