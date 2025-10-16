"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartSheet } from "@/hooks/use-cart-sheet";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the click event to add the product to the cart.
   */
  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      // Simulate API call delay for better UX demonstration
      await new Promise((resolve) => setTimeout(resolve, 500));

      addToCart(product);
      setOpen(true);

      // Show success toast
      toast({
        title: "Added to cart!",
        description: `${product.title} has been added to your cart.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add To Cart
        </>
      )}
    </Button>
  );
}
