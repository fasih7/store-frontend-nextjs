import { Heart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { CardContent, Card } from "../ui/card";
import { Product } from "../../lib/types";

export type CardItem = Product;

export function CardContent2({ itemsArray }: { itemsArray: CardItem[] }) {
  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsArray.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img
                src={item.primaryImage || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 rounded-full p-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
              >
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              </Button>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <h4 className="font-medium text-sm mb-2 line-clamp-2 flex-shrink-0">
                {item.title}
              </h4>
              {/* <div className="flex items-center gap-1 mb-2">
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
              </div> */}
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <span className="font-bold text-lg">Rs: {item.price}</span>
              </div>
              <Button
                size="sm"
                className="w-full mt-auto hover:bg-primary/90 transition-colors duration-200"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  );
}
