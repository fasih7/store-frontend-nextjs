import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import OrderSuccess from "@/components/order-success";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params; // ✅ you must await

  return (
    <>
      <Navbar />
      <OrderSuccess orderId={orderId} />
      <Footer />
    </>
  );
}
