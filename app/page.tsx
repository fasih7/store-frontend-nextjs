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
      {/* <HeroSection /> */}
      <HeroSection2 />
      <Categories />
      <FeaturedProducts />
      <RecentProducts />
      <BestSellingProducts />
      <NewsLetter />
      <Footer />
    </>
  );
}

export default Home;
