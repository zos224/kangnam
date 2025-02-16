import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPage from "./PricingPage";
import FooterAction from "@/components/FooterAction";

export const metadata = {
  title: "Bảng giá",
  description: "Bảng giá dịch vụ tại thẩm mỹ viện Kangnam"
};

export default function BangGia (){
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <PricingPage />
      {/* Footer */}
      <Footer />
    {/* Hiển thị FooterActions chỉ trên thiết bị di động */}
          <div className="block md:hidden">
            <FooterAction />
          </div>
        </div>
      );
    }
    