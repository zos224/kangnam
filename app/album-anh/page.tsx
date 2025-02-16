import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeforeAfterGallery from "./BeforeAfterGallery";
import FooterAction from "@/components/FooterAction";

export const metadata = {
  title: "Hình ảnh khách hàng",
  description: "Album ảnh khách hàng tại thẩm mỹ viện Kangnam"
};

export default function AlbumPhoto(){
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <BeforeAfterGallery />
      {/* Footer */}
      <Footer />

      {/* Hiển thị FooterActions chỉ trên thiết bị di động */}
      <div className="block md:hidden">
        <FooterAction />
      </div>
    </div>
  );
}
