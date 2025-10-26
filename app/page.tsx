"use client";

import Categories from "@/components/categories";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import HeroSection2 from "@/components/hero-section2";
import Navbar from "@/components/navbar";
import NewsLetter from "@/components/news-letter";
import BestSellingProducts from "@/components/products/best-selling";
import FeaturedProducts from "@/components/products/featured-products";
import RecentProducts from "@/components/products/recent-products";

function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <HeroSection2 />

      {/* Categories Section */}
      <Categories />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      {/* Recent Products Section */}
      <RecentProducts />

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      {/* Best Selling Products Section */}
      <BestSellingProducts />

      {/* Newsletter Section */}
      <NewsLetter />

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Home;
