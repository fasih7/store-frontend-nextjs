"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Truck, RefreshCw, Headphones } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection2() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero1.jpg?height=800&width=1200"
          fill
          alt="Store Background"
          className="object-cover"
          priority
        />
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float animate-delay-200"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/15 rounded-full blur-2xl animate-float animate-delay-100"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex justify-center md:justify-end">
          <div
            className={`max-w-3xl text-center space-y-8 transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-6">
              {/* Badge with animation */}
              <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 animate-slide-up">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-2 animate-pulse" />
                <span className="text-white font-medium">
                  Trusted by 10,000+ customers
                </span>
              </div>

              {/* Heading with enhanced typography */}
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-white animate-slide-up animate-delay-100">
                Premium Quality,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-blue-600">
                  Unbeatable Prices
                </span>
              </h1>

              {/* Enhanced description */}
              <p className="max-w-[600px] mx-auto text-gray-200 md:text-xl leading-relaxed animate-slide-up animate-delay-200">
                Discover our curated collection of premium products. From
                everyday essentials to luxury items, we bring you the best
                quality at prices you'll love. Free shipping on orders over $50.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center items-center animate-slide-up animate-delay-300">
              <Link
                href="/products"
                className="group inline-flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ShoppingBag className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="group inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-md px-10 text-base font-semibold text-white shadow-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View Collections
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 animate-fade-in animate-delay-300">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                <div className="relative">
                  <Truck className="w-4 h-4 text-green-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                <span className="font-medium">30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

