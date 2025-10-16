import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Products from "@/components/products/products";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import Search from "../../components/search/search";

function SearchPage() {
  return (
    <>
      <Navbar />
      <Search />
      <Footer />
    </>
  );
}

export default SearchPage;
