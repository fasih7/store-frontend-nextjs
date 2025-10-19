import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a complete image URL by prepending the backend base URL
 * @param imagePath - The relative image path (e.g., "/uploads/products/image.jpg")
 * @returns Complete image URL or fallback to placeholder
 */
export function buildImageUrl(imagePath?: string): string {
  if (!imagePath) {
    return "/placeholder.svg";
  }

  // If it's already a complete URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If it starts with "/", prepend the backend base URL
  if (imagePath.startsWith("/")) {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:4200";
    return `${baseUrl}${imagePath}`;
  }

  // For relative paths without leading slash, add it
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:4200";
  return `${baseUrl}/${imagePath}`;
}
