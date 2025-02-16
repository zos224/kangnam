import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoctorsTeam from "@/components/DoctorTeams";
import BannerSection from "@/components/BannerSection";
import FooterAction from "@/components/FooterAction";


export default function DoctorTeams() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <BannerSection/>
      <DoctorsTeam />
      {/* Footer */}
      <Footer />
    {/* Hiển thị FooterActions chỉ trên thiết bị di động */}
          <div className="block md:hidden">
            <FooterAction />
          </div>
        </div>
      );
    }