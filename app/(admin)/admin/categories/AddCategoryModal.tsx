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
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/shared/use-toast";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function AddCategoryModal() {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Auto-generate slug from name when name changes
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Auto-update slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    register("name").onChange(e);
    const newSlug = generateSlug(name);
    // Only auto-update slug if it's empty or matches the previous auto-generated slug
    if (!slugValue || slugValue === generateSlug(nameValue || "")) {
      setValue("slug", newSlug, { shouldValidate: true });
    }
  };

  const preview = useMemo(() => {
    return image ? { url: URL.createObjectURL(image), name: image.name } : null;
  }, [image]);

  const resetAll = () => {
    reset();
    setImage(null);
  };

  const onSubmit = async (values: FormValues) => {
    if (!image) {
      toast({
        title: "Image required",
        description: "Please upload a category image to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", values.name);
      form.append("slug", values.slug);
      form.append("image", image);

      await categoriesGateway.createCategory(form);

      toast({
        title: "Category created",
        description: "Your category has been added successfully.",
        variant: "success",
      });
      setOpen(false);
      resetAll();
      router.refresh();
    } catch (e: any) {
      const description =
        e?.body?.message || e?.message || "Failed to create category";
      toast({
        title: "Create failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a new category. Upload an image and provide category details.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Category name"
                {...register("name")}
                onChange={handleNameChange}
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
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly identifier (auto-generated from name)
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
                  !image && "text-muted-foreground"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    setImage(file);
                  }
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    const f = (input.files && input.files[0]) || null;
                    if (f) setImage(f);
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
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow-lg p-1 hover:bg-red-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                      }}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
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
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={resetAll}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
