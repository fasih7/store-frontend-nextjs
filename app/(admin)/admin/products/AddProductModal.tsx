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
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/shared/use-toast";

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

type AddProductModalProps = {
  onProductAdded?: () => void;
};

export function AddProductModal({ onProductAdded }: AddProductModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Images state
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await categoriesGateway.getManyCategories();
        const items: Category[] = res?.data || res || [];
        if (mounted) setCategories(items);
      } catch (e) {
        // silent fail for dropdown
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onDropGallery = (files: FileList | null) => {
    if (!files) return;
    const existing = galleryImages;
    const incoming = Array.from(files);
    const combined = [...existing, ...incoming].slice(0, 5);
    setGalleryImages(combined);
  };

  const removeGalleryAt = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const previews = useMemo(() => {
    const primary = primaryImage
      ? { url: URL.createObjectURL(primaryImage), name: primaryImage.name }
      : null;
    const gallery = galleryImages.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    return { primary, gallery };
  }, [primaryImage, galleryImages]);

  const resetAll = () => {
    reset();
    setPrimaryImage(null);
    setGalleryImages([]);
  };

  const onSubmit = async (values: FormValues) => {
    if (!primaryImage) {
      toast({
        title: "Primary image required",
        description: "Please upload a primary image to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", values.title);
      form.append("description", values.description);
      form.append("price", values.price);
      form.append("quantity", values.quantity);
      form.append("category", values.categoryId);
      form.append("primaryImage", primaryImage);
      galleryImages.forEach((img) => form.append("images", img));

      await productGateway.createProduct(form);

      toast({
        title: "Product created",
        description: "Your product has been added successfully.",
        variant: "success",
      });
      setOpen(false);
      resetAll();
      onProductAdded?.();
    } catch (e: any) {
      const description =
        e?.body?.message || e?.message || "Failed to create product";
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
          <Upload className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Create a new product. Upload a primary image and up to 5 gallery images.
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
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
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
                  <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
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
                onValueChange={(val) => setValue("categoryId", val, { shouldValidate: true })}
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
                  !primaryImage && "text-muted-foreground"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) setPrimaryImage(file);
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => {
                    const f = (input.files && input.files[0]) || null;
                    if (f) setPrimaryImage(f);
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
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryImage(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-36">
                    <ImageIcon className="h-6 w-6 mb-2" />
                    <p className="text-sm">Click or drop an image</p>
                  </div>
                )}
              </div>
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
                  Click or drop images ({galleryImages.length}/5)
                </p>
              </div>

              {galleryImages.length > 0 && (
                <ScrollArea className="mt-3 h-40 rounded-md border">
                  <div className="p-3 grid grid-cols-3 gap-3">
                    {galleryImages.map((file, idx) => (
                      <div key={idx} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-24 w-full object-cover rounded-md shadow"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
                          onClick={() => removeGalleryAt(idx)}
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
            <Button type="button" variant="outline" onClick={() => resetAll()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

export default AddProductModal;


