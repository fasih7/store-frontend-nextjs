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
    <Card className="group overflow-hidden border hover:shadow-2xl transition-all duration-500 hover:border-primary/30 h-full flex flex-col glass-card backdrop-blur-xl animate-float-up">
      {/* Image Container with Overlay */}
      <Link href={`/products/${product.id}`} className="relative block">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
          {/* Glowing Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>

          {/* Image */}
          <img
            src={buildImageUrl(product.primaryImage)}
            alt={product.title || "Product"}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading Placeholder with Shimmer */}
          {!imageLoaded && <div className="absolute inset-0 skeleton-loader" />}

          {/* Wishlist Button with Glass Effect */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full h-10 w-10 glass-button backdrop-blur-md 
                     shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 
                     hover:scale-110 hover:shadow-xl z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 glow-on-hover ${
                isWishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {/* Category Badge with Glass Effect */}
          {product.category?.name && (
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span
                className="px-3 py-1.5 text-xs font-semibold glass-button backdrop-blur-md 
                             rounded-full shadow-lg text-gray-700 dark:text-gray-200"
              >
                {product.category.name}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        {/* Product Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg line-clamp-2 hover:text-primary transition-all duration-300 text-gray-900 dark:text-gray-100 leading-tight hover:translate-x-1">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold gradient-text-primary">
            Rs. {product.price}
          </span>
        </div>
      </CardContent>

      {/* Footer with Action Button */}
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => {
            addToCart(product);
            setOpen(true);
          }}
          className="w-full h-12 font-semibold text-sm gradient-bg-primary text-primary-foreground 
                   shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] 
                   active:scale-[0.98] glow-primary hover:glow-primary group"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
