import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomerStory from "./CustomerStory";
import FooterAction from "@/components/FooterAction";

export const metadata = {
  title: "Câu chuyện khách hàng",
  description: "Những câu chuyện về khách hàng tại thẩm mỹ viện Kangnam"
};

export default function CustomerStoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <CustomerStory/>
      {/* Footer */}
      <Footer />
    {/* Hiển thị FooterActions chỉ trên thiết bị di động */}
          <div className="block md:hidden">
            <FooterAction />
          </div>
        </div>
      );
    }