import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import Products2 from "../../components/products/products-2";

function ProductsPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbNav />
      <Products2 />
      <Footer />
    </>
  );
}

export default ProductsPage;
