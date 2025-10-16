"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { useCartSheet } from "@/hooks/use-cart-sheet";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: Readonly<ProductCardProps>) {
  const { addToCart } = useCart();
  const { setOpen } = useCartSheet();

  return (
    <Card className="overflow-hidden py-0 gap-0">
      {/* Link to the product's detail page */}
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100 group-hover:opacity-75">
          {/* <Image will change back to it with local images */}
          <img
            src={product.primaryImage || "/placeholder.svg"}
            alt={product.title || "Product"}
            // fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="px-4">
        {/* Product name linking to its detail page */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium mt-2 text-lg">{product.title}</h3>
        </Link>
        {/* <p className="text-sm text-gray-500 mt-1">{product.category}</p> */}
        <p className="font-medium text-lg mt-2">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          onClick={() => {
            addToCart(product);
            setOpen(true);
          }}
          className="w-full"
          variant="outline"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
