"use client";

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useHeaderData } from "@/hooks/useHeaderData";
import { useSettingData } from "@/hooks/useSettingData";
import { useLanguageData } from "@/hooks/useLanguageData";
import { MapPin } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [subMenu, setSubMenu] = useState<string | null>(null);
  const { languages } = useLanguageData()
  const { services, blogTypes, loading } = useHeaderData();
  const { setting } = useSettingData() 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLocation = () => setIsLocationOpen(!isLocationOpen);

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  const handleSubMenuEnter = (submenu: string) => {
    setActiveSubMenu(submenu);
  };

  return (
    !loading &&
    <header className="fixed top-0 left-0 w-full z-[105] bg-[#D4EAFF] shadow-md font-montserrat transition-transform duration-300">
      {/* Top Section */}
      <div className="container max-w-[1170px] flex items-center justify-between h-[65px] px-4 lg:px-8 mx-auto">
        {/* Logo */}
        <Link href="/" className="block w-[142px]">
          <Image
            className="w-full h-auto"
            src={setting?.logo || ""}
            alt="Bệnh viện thẩm mỹ Kangnam"
            width={215}
            height={65}
          />
        </Link>

        {/* PC Actions */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/hao-quang/mot-cham-den-hao-quang/index.html"
            className="border border-[#003C77] text-[#003C77] px-2 py-1 rounded-full hover:bg-[#003C77] hover:text-white transition-all"
          >
            Chạm tới Hào quang
          </Link>
          <a
            href="https://kangnamaesthetichospital.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 border border-[#003C77] text-[#003C77] px-2 py-1 rounded-full hover:bg-[#003C77] hover:text-white transition-all"
          >
            Kangnam Hải ngoại &#43;
          </a>
          <div className="ml-4 w-[210px]">
            <Image
              className="w-full h-auto"
              src="/global.png"
              alt="Global"
              width={390}
              height={51}
            />
          </div>
          <div className="ml-4 w-[32px] cursor-pointer">
            <MapPin size={32} onClick={toggleLocation} />
          </div>
          <div className="ml-4">
            <select className="px-2 py-0.5" onChange={(e) => {localStorage.setItem("currentLang", e.target.value); window.location.reload()}}>
              {languages.map((language, index) => (
                <option key={index} value={language.id}>{language.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button onClick={toggleMenu} className="w-8 h-8 flex items-center justify-center focus:outline-none">
            {isMenuOpen ? <FaTimes className="text-[#003C77] text-2xl" /> : <FaBars className="text-[#003C77] text-2xl" />}
          </button>

          <button onClick={toggleLocation} className="w-8 h-8 flex items-center justify-center focus:outline-none">
            <MapPin size={24} onClick={toggleLocation} />
          </button>
          <div className="ml-4">
            <select className="px-2 py-0.5" onChange={(e) => {localStorage.setItem("currentLang", e.target.value); window.location.reload()}}>
              {languages.map((language, index) => (
                <option key={index} value={language.id}>{language.code}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Bar (PC) */}
<div className="hidden lg:block relative z-[1] bg-white">
  <div className="container mx-auto px-4 max-w-[1170px]">
    <ul className="flex justify-around text-left w-full">
      {/* Dịch vụ */}
      <li
        className="relative inline-block w-[14%]"
        onMouseEnter={() => handleMouseEnter("dich-vu")}
        onMouseLeave={handleMouseLeave}
      >
        <Link href="#" className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Dịch Vụ
        </Link>
        {activeMenu === "dich-vu" && (
          <ul className="absolute left-0 bg-white shadow-md w-[250px]">
            {services.map((service) => (
              <li
                key={service.id}
                className="relative px-4 py-2 hover:bg-[#db7f27]"
                onMouseEnter={() => handleSubMenuEnter(`service-${service.id}`)}
                onMouseLeave={() => setActiveSubMenu(null)}
              >
                <Link href={`/dich-vu/${service.slug}`}>{service.name}</Link>
                {activeSubMenu === `service-${service.id}` && service.serviceItems.length > 0 && (
                  <ul className="absolute left-full top-0 bg-white shadow-md w-[250px]">
                    {service.serviceItems.map((item) => (
                      <li key={item.id} className="px-4 py-2 hover:bg-[#db7f27]">
                        <Link href={`/dich-vu/${service.slug}/${item.blog.slug}`}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>

      {/* Bảng giá */}
      <li className="inline-block w-[14%]">
        <Link href="/bang-gia" className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Bảng Giá
        </Link>
      </li>

      {/* Ảnh Trước - Sau */}
      <li className="inline-block w-[14%]">
        <Link href="/album-anh" className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Ảnh Trước - Sau
        </Link>
      </li>

      {/* Đội Ngũ Bác Sĩ */}
      <li className="inline-block w-[14%]">
        <Link href="/doi-ngu-bac-si" className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Đội Ngũ Bác Sĩ
        </Link>
      </li>

      {/* Story (Mục mới thêm vào) */}
      <li className="inline-block w-[14%]">
        <Link href="/story" className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Story
        </Link>
      </li>

      {/* Tin tức - sự kiện */}
      <li
        className="relative inline-block w-[14%]"
        onMouseEnter={() => handleMouseEnter("tin-tuc")}
        onMouseLeave={handleMouseLeave}
      >
        <div className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Tin Tức - Sự Kiện
        </div>
        {activeMenu === "tin-tuc" && (
          <ul className="absolute left-0 bg-white shadow-md w-[250px]">
            {blogTypes.map((type) => (
              <li key={type.id} className="px-4 py-2 hover:bg-[#db7f27]">
                <Link href={`/tin-tuc/${type.slug}`}>{type.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>

      {/* Giới Thiệu */}
      <li
        className="relative inline-block w-[14%]"
        onMouseEnter={() => handleMouseEnter("gioi-thieu")}
        onMouseLeave={handleMouseLeave}
      >
        <Link href="/gioi-thieu" className="block px-2 py-2 text-sm font-medium capitalize hover:text-[#db7f27] transition-colors">
          Giới Thiệu Kangnam
        </Link>
        {activeMenu === "gioi-thieu" && (
          <ul className="absolute left-0 bg-white shadow-md w-[250px]">
            <li className="px-4 py-2 hover:bg-[#db7f27]">
              <Link href="/gioi-thieu/">Về Kangnam</Link>
            </li>
            <li className="px-4 py-2 hover:bg-[#db7f27]">
              <Link href="/co-so-vat-chat/">Cơ Sở Vật Chất</Link>
            </li>
          </ul>
        )}
      </li>
    </ul>
  </div>
</div>


      {/* Mobile Menu Drawer */}
      <div
    className={`fixed top-0 left-0 w-full max-w-[320px] h-full bg-white shadow-lg z-[110] transform ${
      isMenuOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-300 lg:hidden`}
  >
    <div className="p-4 border-b border-gray-300">
      <button onClick={toggleMenu} className="text-[#003c77] text-lg font-bold">
        ✕ Đóng
      </button>
    </div>

    <ul className="space-y-4 p-4 text-[#003c77] font-medium">
      {/* Dịch Vụ */}
      <li>
        <button
          onClick={() => setActiveMenu(activeMenu === "dich-vu" ? null : "dich-vu")}
          className="w-full text-left"
        >
          Dịch Vụ {activeMenu === "dich-vu" ? "▲" : "▼"}
        </button>
        {activeMenu === "dich-vu" && (
          <ul className="pl-4 mt-2 space-y-2 text-gray-700">
            {services.map((service) => (
              <li key={service.id}>
                <button
                  onClick={() => setSubMenu(subMenu === `service-${service.id}` ? null : `service-${service.id}`)}
                  className="w-full text-left"
                >
                  {service.name} {subMenu === `service-${service.id}` ? "▲" : "▼"}
                </button>
                {subMenu === `service-${service.id}` && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {service.serviceItems.map((item) => (
                      <li key={item.id}>
                        <Link href={`/dich-vu/${service.slug}/${item.blog.slug}`}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
      
      {/* Bảng Giá */}
      <li><Link href="/bang-gia">Bảng Giá</Link></li>
      
      {/* Ảnh Trước - Sau */}
      <li><Link href="/album-anh">Ảnh Trước - Sau</Link></li>
      
      {/* Đội Ngũ Bác Sĩ */}
      <li><Link href="/doi-ngu-bac-si">Đội Ngũ Bác Sĩ</Link></li>
      
      {/* Story */}
      <li><Link href="/story">Story</Link></li>
      
      {/* Tin Tức - Sự Kiện */}
      <li>
        <button
          onClick={() => setActiveMenu(activeMenu === "tin-tuc" ? null : "tin-tuc")}
          className="w-full text-left"
        >
          Tin Tức - Sự Kiện {activeMenu === "tin-tuc" ? "▲" : "▼"}
        </button>
        {activeMenu === "tin-tuc" && (
          <ul className="pl-4 mt-2 space-y-2">
            {blogTypes.map((type) => (
              <li key={type.id}>
                <Link href={`/tin-tuc/${type.slug}`}>{type.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
      
      {/* Giới Thiệu Kangnam */}
      <li>
        <button
          onClick={() => setActiveMenu(activeMenu === "gioi-thieu" ? null : "gioi-thieu")}
          className="w-full text-left"
        >
          Giới Thiệu Kangnam {activeMenu === "gioi-thieu" ? "▲" : "▼"}
        </button>
        {activeMenu === "gioi-thieu" && (
          <ul className="pl-4 mt-2 space-y-2">
            <li><Link href="/gioi-thieu/">Về Kangnam</Link></li>
            <li><Link href="/co-so-vat-chat/">Cơ Sở Vật Chất</Link></li>
          </ul>
        )}
      </li>
    </ul>
  </div>


{/* Overlay */}
{(isMenuOpen || isLocationOpen) && (
  <div
    onClick={() => {
      setIsMenuOpen(false);
      setIsLocationOpen(false);
    }}
    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 z-[100] lg:hidden"
  ></div>
)}

    </header>
  );
};

export default Header;
