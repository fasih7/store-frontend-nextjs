"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";
import { Product } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { productGateway } from "@/domain/gateways/products.gateway";

interface Params {
  id: string;
}

/**
 * The product page component
 * @param {Params} params The route params
 * @returns {JSX.Element} The component
 */
export default function SingleProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = React.use(params);

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  // Retrieve all products from the data source

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
  }, []);

  return (
    <>
      {/* The navbar component */}
      <Navbar />

      {/* The main content */}
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* The product image */}
            <div className="relative aspect-square w-full">
              {/* <Image todo: add the product image  */}
              <img
                src={product?.primaryImage || "/placeholder/400x400.svg"}
                alt={product?.title || "Product"}
                // layout="fill"
                className="object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* The product details */}
            <div className="flex flex-col space-y-4 justify-center">
              {/* The product name */}
              <h1 className="text-3xl font-bold text-gray-800">
                {product?.title}
              </h1>

              {/* The product category */}
              <p className="text-sm text-gray-500">{product?.category}</p>

              {/* The product price */}
              <p className="text-xl text-gray-800 font-semibold">
                ${product?.price.toFixed(2)}
              </p>

              {/* The product description */}
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Description
                </h3>
                <p className="text-gray-600 mt-2">{product?.description}</p>
              </div>

              {/* The add to cart button */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>

      {/* The footer component */}
      <Footer />
    </>
  );
}
