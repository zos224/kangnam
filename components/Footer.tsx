"use client"
import React from "react";
import Image from "next/image";
import { useSettingData } from "@/hooks/useSettingData";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const {setting, loading} = useSettingData();
  return (
    !loading && 
    <footer className="bg-[#d4eaff] text-[#003c77] font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Cột trái */}
          <div className="lg:w-1/2 space-y-6">
            {/* Logo */}
            <Image
              src={setting?.logo || ""}
              alt="Bệnh viện thẩm mỹ Kangnam"
              className="max-w-[215px]"
              width={215}
              height={65}
            />

            {/* Lịch làm việc */}
            <div>
              <p className="font-bold flex items-center gap-2">
                <Calendar className="w-6" />
                Lịch làm việc:
              </p>
              <p>{setting?.workTime}</p>
            </div>

            {/* Hệ thống chi nhánh */}
            <div>
              <p className="font-bold flex items-center gap-2">
                <MapPin className="w-6" />
                Hệ thống chi nhánh:
              </p>
              <p>
                Hà Nội, TP.HCM, Hải Phòng, Nghệ An, Đà Nẵng, Cần Thơ, Bình
                Dương, Thanh Hóa, Buôn Ma Thuột
              </p>
            </div>

            {/* Thông tin thêm */}
            <div className="text-sm leading-6 flex flex-wrap gap-2">
              <Link href={setting?.chinhSachBaoMat?.slug ? "/bai-viet/" + setting?.chinhSachBaoMat.slug : ""}>Chính sách bảo mật</Link>
              -
              <Link href={setting?.dieuKhoanSuDung?.slug ? "/bai-viet/" + setting?.dieuKhoanSuDung.slug : ""}>Điều khoản sử dụng</Link>
              -
              <Link href={setting?.chinhSachRiengTu?.slug ? "/bai-viet/" + setting?.chinhSachRiengTu.slug : ""}>Chính sách riêng tư</Link>
              -
              <Link href={setting?.quyTrinhKiemSoat?.slug ? "/bai-viet/" + setting?.quyTrinhKiemSoat.slug : ""}>Quy trình kiểm duyệt nội dung</Link>
              -
              <Link href={setting?.tieuChuanChatLuong?.slug ? "/bai-viet/" + setting?.tieuChuanChatLuong.slug : ""}>Tiêu chuẩn chất lượng</Link>
            </div>

            {/* Ứng dụng */}
            <div className="text-sm">
              Ứng dụng Mobile:{" "}
              <a
                href="https://play.google.com/store/apps/details?id=com.kangnam.member"
                target="_blank"
                rel="nofollow"
                className="underline"
              >
                Google Play
              </a>{" "}
              -{" "}
              <a
                href="https://apps.apple.com/us/app/kangnam-beauty/id6446275848"
                target="_blank"
                rel="nofollow"
                className="underline"
              >
                Apple Store
              </a>
            </div>
          </div>

          {/* Cột phải */}
          <div className="lg:w-1/2">
            {/* Hai nút */}
            <div className="flex gap-6 mb-6">
              {/* Hotline */}
              <a
                href="tel:19006466"
                className="flex flex-1 items-center justify-between bg-white text-[#003c77] border border-[#003c77] rounded-lg p-4 hover:bg-[#003c77] hover:text-white transition h-[80px]"
              >
                <Image
                  src="/phone.svg"
                  alt="Hotline"
                  width={215}
                  height={65}
                  className="w-8 h-8"
                />
                <div>
                  <p className="font-bold uppercase text-lg">Hotline</p>
                  <span className="text-lg font-bold">{setting?.hotline}</span>
                </div>
              </a>

              {/* Đặt lịch */}
              <a
                href="#"
                className="flex flex-1 items-center justify-between bg-white text-[#003c77] border border-[#003c77] rounded-lg p-4 hover:bg-[#003c77] hover:text-white transition h-[80px]"
              >
                <Image
                  src="/calculator-s.svg"
                  alt="Đặt lịch"
                  className="w-8 h-8"
                  width={4}
                  height={4}
                />
                <div>
                  <p className="font-bold uppercase text-lg">Đặt lịch</p>
                  <span className="text-sm">Nhận tư vấn</span>
                </div>
              </a>
            </div>

            {/* Thông tin bổ sung */}
            <p className="uppercase font-bold mb-4">
              {setting?.titleFooter}
            </p>
            <p className="text-sm">
              {setting?.detailFooter}
            </p>
          </div>
        </div>

        {/* Mạng xã hội */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href={setting?.urlFacebook || ""}
            target="_blank"
            rel="nofollow"
            className="hover:opacity-75"
          >
            <Image
              src="/facebook.svg"
              alt="Facebook"
              className="w-8"
              width={32}
              height={32}
            />
          </Link>
          <Link
            href={setting?.urlYoutube || ""}
            target="_blank"
            rel="nofollow"
            className="hover:opacity-75"
          >
            <Image
              src="/youtube.svg"
              alt="YouTube"
              className="w-8"
              width={32}
              height={32}
            />
          </Link>
          <Link
            href={setting?.urlInstagram || ""}
            target="_blank"
            rel="nofollow"
            className="hover:opacity-75"
        
          >
            <Image
              src="/instagram.svg"
              alt="Instagram"
              className="w-8"
              width={32}
              height={32}
            />
          </Link>
          <Link
            href={setting?.urlTiktok || ""}
            target="_blank"
            rel="nofollow"
            className="hover:opacity-75"
          >
            <Image
              src="/tik_tok.svg"
              alt="TikTok"
              className="w-8"
              width={32}
              height={32}
            />
          </Link>
        </div>

        {/* Ghi chú */}
        <div className="mt-6 bg-[#004689] text-white py-2 text-center">
          Kết quả phụ thuộc vào cơ địa mỗi người (*)
        </div>
      </div>
    </footer>
  );
};

export default Footer;

