"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriesGateway } from "@/domain/gateways/customer/categories.gateway";
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
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/shared/use-toast";
import type { Category } from "@/domain/entities/category.entity";
import { buildImageUrl } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

interface EditCategoryModalProps {
  category: Category;
}

export default function EditCategoryModal({
  category,
}: EditCategoryModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing image state
  const [existingImagePath, setExistingImagePath] = useState<string | null>(
    category.image || null
  );
  const [originalImagePath] = useState<string | null>(category.image || null);
  const [imageRemoved, setImageRemoved] = useState<boolean>(false);

  // New image state
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
    },
  });

  // Auto-generate slug from name when name changes
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const resetToCategory = () => {
    reset({
      name: category.name,
      slug: category.slug,
    });
    setExistingImagePath(category.image || null);
    setImageRemoved(false);
    setNewImageFile(null);
  };

  const preview = useMemo(() => {
    if (newImageFile) {
      return {
        url: URL.createObjectURL(newImageFile),
        name: newImageFile.name,
      };
    }
    if (!imageRemoved && existingImagePath) {
      return {
        url: buildImageUrl(existingImagePath),
        name: existingImagePath,
        existing: true,
      };
    }
    return null;
  }, [existingImagePath, newImageFile, imageRemoved]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", values.name);
      form.append("slug", values.slug);

      // Only append image if a new one was selected
      if (newImageFile) {
        form.append("image", newImageFile);
      }

      await categoriesGateway.updateCategory(category.id, form);

      toast({
        title: "Category updated",
        description: "Your category has been updated successfully.",
        variant: "success",
      });
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      const description =
        e?.body?.message || e?.message || "Failed to update category";
      toast({
        title: "Update failed",
        description,
        variant: "destructive",
      });
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
          resetToCategory();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update category details and image.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Category name"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  const newSlug = generateSlug(e.target.value);
                  const currentSlug = watch("slug");
                  // Auto-update slug if it matches the previous auto-generated slug
                  if (
                    currentSlug &&
                    currentSlug === generateSlug(category.name)
                  ) {
                    setValue("slug", newSlug, { shouldValidate: true });
                  }
                }}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input
                placeholder="category-slug"
                {...register("slug")}
                onBlur={(e) => {
                  // Ensure slug is properly formatted
                  const formatted = generateSlug(e.target.value);
                  if (formatted !== e.target.value) {
                    e.target.value = formatted;
                    setValue("slug", formatted, { shouldValidate: true });
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly identifier
              </p>
              {errors.slug && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Image</label>
              <div
                className={cn(
                  "mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40 transition-colors",
                  !(existingImagePath || newImageFile) &&
                    "text-muted-foreground"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    setNewImageFile(file);
                    setImageRemoved(false);
                  }
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    const f = (input.files && input.files[0]) || null;
                    if (f) {
                      setNewImageFile(f);
                      setImageRemoved(false);
                    }
                  };
                  input.click();
                }}
              >
                {preview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="h-48 w-48 object-cover rounded-md shadow-lg"
                    />
                    {(existingImagePath || newImageFile) && (
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg p-1 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (newImageFile) {
                            setNewImageFile(null);
                          } else if (existingImagePath) {
                            setImageRemoved(true);
                            setExistingImagePath(null);
                          }
                        }}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48">
                    <ImageIcon className="h-12 w-12 mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      Click or drop an image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Replace to change the image. Upload a new image to replace the
                current one.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
