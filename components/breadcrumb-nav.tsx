"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home page or single level
  }

  return (
    <div className={`py-4 ${className}`}>
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {item.href && index < breadcrumbItems.length - 1 ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    // Convert segment to readable label
    let label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    // Special cases for better labels
    if (segment === "products") label = "Products";
    if (segment === "categories") label = "Categories";
    if (segment === "search") label = "Search Results";
    if (segment === "checkout") label = "Checkout";
    if (segment === "profile-page") label = "Profile";
    if (segment === "auth") label = "Authentication";

    // For dynamic routes like [id] or [slug], you might want to fetch the actual name
    // For now, we'll use the segment as is

    items.push({
      label,
      href: i < segments.length - 1 ? href : undefined, // Last item shouldn't be a link
    });
  }

  return items;
}
