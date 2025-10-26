"use client";

import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartSheet } from "@/hooks/use-cart-sheet";
import { buildImageUrl } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: Readonly<ProductCardProps>) {
  const { addToCart } = useCart();
  const { setOpen } = useCartSheet();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="group overflow-hidden border hover:shadow-xl transition-all duration-500 hover:border-primary/20 h-full flex flex-col bg-background">
      {/* Image Container with Overlay */}
      <Link href={`/products/${product.id}`} className="relative block">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Image */}
          <img
            src={buildImageUrl(product.primaryImage)}
            alt={product.title || "Product"}
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
          )}

          {/* Wishlist Button */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isWishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button> */}

          {/* Category Badge */}
          {/* <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1.5 text-xs font-medium bg-white/95 backdrop-blur-sm rounded-full shadow-sm text-gray-700 border border-gray-200">
              {product.category?.name}
            </span>
          </div> */}
        </div>
      </Link>

      {/* Content Section */}
      <CardContent className="p-5 flex-1 flex flex-col gap-3">
        {/* Product Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-base line-clamp-2 hover:text-primary transition-colors duration-200 text-gray-900 dark:text-gray-100 leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            Rs. {product.price}
          </span>
        </div>
      </CardContent>

      {/* Footer with Action Button */}
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => {
            addToCart(product);
            setOpen(true);
          }}
          className="w-full h-11 font-medium text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
