import Link from "next/link";
import { Button } from "./ui/button";

/**
 * The hero section of the homepage, with background image.
 */
const HeroSection = () => {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-blue-100 bg-[url('/images/hero1.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* The content container */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Discover Quality Products
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
            Shop our curated collection of premium products designed for modern
            living.
          </p>
        </div>

        <div>
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
