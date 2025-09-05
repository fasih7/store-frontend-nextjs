import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";

export default function HeroSection2() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero1.jpg?height=800&width=1200"
          fill
          alt="Store Background"
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex justify-center md:justify-end">
          <div className="max-w-3xl text-center space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-white/10 backdrop-blur-sm border-white/20 shadow-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-2" />
                <span className="text-white">Trusted by 10,000+ customers</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Premium Quality,{" "}
                <span className="text-primary">Unbeatable Prices</span>
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our curated collection of premium products. From
                everyday essentials to luxury items, we bring you the best
                quality at prices you'll love. Free shipping on orders over $50.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop Now
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                View Collections
              </Link>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-300 justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
