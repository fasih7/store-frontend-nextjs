"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartSheet } from "@/hooks/use-cart-sheet";

interface ProductCartProps {
  product: Product;
  className?: string;
}

/**
 * Component for the "Add To Cart" button.
 *
 * @param product - The product to add to the cart.
 * @param className - Additional classes for styling the button.
 */
export default function AddToCartButton({ product, className }: any) {
  const { addToCart } = useCart();
  const { setOpen } = useCartSheet();

  /**
   * Handles the click event to add the product to the cart.
   */
  const handleAddToCart = () => {
    addToCart(product);
    setOpen(true);
  };

  return (
    <Button onClick={handleAddToCart} className={className}>
      <ShoppingCart className="mr-2" />
      Add To Cart
    </Button>
  );
}
