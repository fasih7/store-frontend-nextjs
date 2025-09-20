import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useCartSheet } from "@/hooks/use-cart-sheet";
export default function CartSheet() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { open, setOpen } = useCartSheet();

  const totalItems = items.length;
  const subtotal = items.reduce(
    (sum, item) => sum + +item.price * (item.quantity ?? 1),
    0
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setOpen(true)}
        >
          <ShoppingBag className="h-5 w-7" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add some products to your cart to see them here.
              </p>
            </div>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[65vh]">
              <div className="space-y-4 px-8">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded">
                      {/* <Image todo: will update with local images*/}
                      <img
                        src={item.primaryImage}
                        alt={item.title}
                        // fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h5 className="font-medium">{item.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        {item.price}
                      </p>
                    </div>
                    <div className="relative flex items-center max-w-[8rem]">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity ?? 1) - 1)
                        }
                        className="rounded-none rounded-l-lg h-10"
                      >
                        <Minus className="w-2 h-2" />
                      </Button>
                      <div className="flex items-center justify-center min-w-[2.5rem] h-10 border-y border-x border-gray-300 text-center text-base dark:border-gray-600">
                        <span className="text-gray-900 dark:text-white">
                          {item.quantity ?? 1}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, (item.quantity ?? 1) + 1)
                        }
                        className="rounded-none rounded-r-lg h-10"
                      >
                        <Plus className="w-2 h-2" />
                      </Button>
                    </div>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Total */}
            <Separator />
            <div className="space-y-4 mt-4 px-8">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">
                  {Math.round(subtotal * 100) / 100}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => clearCart()}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
