import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Heart, Star } from "lucide-react";

export default function WishlistTab() {
  return (
    <TabsContent value="wishlist" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
          <CardDescription>Items you've saved for later</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Wireless Bluetooth Headphones",
                price: "$99.99",
                originalPrice: "$129.99",
                rating: 4.5,
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Smart Fitness Watch",
                price: "$199.99",
                originalPrice: null,
                rating: 4.8,
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Portable Bluetooth Speaker",
                price: "$49.99",
                originalPrice: "$69.99",
                rating: 4.3,
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 rounded-full p-2 bg-transparent"
                  >
                    <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(item.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({item.rating})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {item.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="w-full">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
