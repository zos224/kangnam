"use client";
import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function FooterAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden z-50`}
      >
        <div className="bg-[#1F355D] p-3 rounded-full shadow-lg flex items-center gap-3 px-6">
          {/* Nút gọi */}
          <a
            href="tel:19006466"
            className="bg-green-500 text-white rounded-full p-3 flex items-center justify-center shadow-md"
          >
            <FaPhoneAlt size={20} />
          </a>

          {/* Nút Zalo */}
          <a
            href="https://zalo.me/123456789"
            className="bg-blue-500 text-white rounded-full p-3 flex items-center justify-center shadow-md"
          >
            <SiZalo size={24} />
          </a>

          {/* Nút Nhận báo giá */}
          <button
            onClick={() => setShowPopup(true)}
            className="bg-yellow-500 text-white rounded-full px-6 py-3 flex items-center justify-center text-sm font-bold shadow-md whitespace-nowrap"
          >
            Nhận báo giá
          </button>
        </div>
      </div>

      {/* Popup Nhận báo giá */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold text-center mb-4">
              Nhận báo giá dịch vụ
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chọn dịch vụ
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn dịch vụ</option>
                  <option value="tham-my-khuon-mat">Thẩm mỹ khuôn mặt</option>
                  <option value="chinh-hinh-ham-mat">Chỉnh hình hàm mặt</option>
                  <option value="tao-hinh-voc-dang">Tạo hình vóc dáng</option>
                  <option value="tre-hoa-da">Trẻ hóa & điều trị da</option>
                  <option value="nha-khoa">Nha khoa thẩm mỹ</option>
                </select>
              </div>
              <div className="flex justify-center mt-4 gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Gửi yêu cầu
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded-full"
                  onClick={() => setShowPopup(false)}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
