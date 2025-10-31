import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}



