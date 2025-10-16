import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Products from "@/components/products/products";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

function ProductsPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbNav />
      <Products />
      <Footer />
    </>
  );
}

export default ProductsPage;
