"use client";

// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";
import { Product } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { productGateway } from "@/domain/gateways/customer/products.gateway";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { buildImageUrl } from "@/lib/utils";

// Product Image Gallery Component
interface ProductImageGalleryProps {
  product?: Product;
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

function ProductImageGallery({ product, selectedImage, onImageSelect }: ProductImageGalleryProps) {
  const currentImage = product?.images && product.images.length > 0 
    ? product.images[selectedImage] 
    : product?.primaryImage;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-gray-50 shadow-sm overflow-hidden flex items-center justify-center">
        <Image
          src={buildImageUrl(currentImage)}
          alt={product?.title || "Product"}
          width={600}
          height={600}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* Image Thumbnails */}
      {product?.images && product.images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={buildImageUrl(image)}
                alt={`${product.title} ${index + 1}`}
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Product Header Component
interface ProductHeaderProps {
  product?: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
}

function ProductHeader({ product, isWishlisted, onToggleWishlist, onShare }: ProductHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {product?.category?.name}
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleWishlist}
            className={`p-2 ${
              isWishlisted ? "text-red-500" : "text-gray-400"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "fill-current" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="p-2"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
        {product?.title}
      </h1>

      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          (4.8) • 124 reviews
        </span>
      </div>
    </div>
  );
}

// Product Price Component
interface ProductPriceProps {
  product?: Product;
}

function ProductPrice({ product }: ProductPriceProps) {
  const price = product?.price ? parseFloat(product.price) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          ${product?.price}
        </span>
        <span className="text-lg text-gray-500 line-through">
          ${(price * 1.2).toFixed(2)}
        </span>
        <Badge variant="destructive" className="text-xs">
          Save 20%
        </Badge>
      </div>
      <p className="text-sm text-gray-600">
        Free shipping on orders over $50
      </p>
    </div>
  );
}

// Quantity Selector Component
interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (change: number) => void;
}

function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Quantity
      </label>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="h-10 w-10 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">
          {quantity}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuantityChange(1)}
          className="h-10 w-10 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Product Features Component
function ProductFeatures() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
        <Truck className="h-5 w-5 text-blue-600" />
        <div>
          <p className="text-sm font-medium">Free Shipping</p>
          <p className="text-xs text-gray-500">On orders over $50</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
        <Shield className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-sm font-medium">Secure Payment</p>
          <p className="text-xs text-gray-500">100% protected</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
        <RotateCcw className="h-5 w-5 text-purple-600" />
        <div>
          <p className="text-sm font-medium">Easy Returns</p>
          <p className="text-xs text-gray-500">30-day policy</p>
        </div>
      </div>
    </div>
  );
}

interface Params {
  id: string;
}

// The product page component
export default function SingleProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = React.use(params);

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const product = await productGateway.getProductById(id);
        console.log({ product });

        setProduct(product);
      } catch (error) {
        console.error("Failed to load products", error);
        return notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [id]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="bg-white min-h-screen py-8">
          <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="flex gap-2">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <Skeleton className="h-20 w-20 rounded-lg" />
                </div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}

      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ProductImageGallery 
              product={product}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <ProductHeader
                product={product}
                isWishlisted={isWishlisted}
                onToggleWishlist={toggleWishlist}
                onShare={handleShare}
              />

              <Separator />

              {/* Price */}
              <ProductPrice product={product} />

              {/* Quantity Selector */}
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />

              {/* Add to Cart */}
              <div className="space-y-3">
                <AddToCartButton
                  product={product}
                  className="w-full h-12 text-base font-medium"
                />
                <Button variant="outline" className="w-full h-12 text-base">
                  Buy Now
                </Button>
              </div>

              {/* Features */}
              <ProductFeatures />

              <Separator />

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}
