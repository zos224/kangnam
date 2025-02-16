"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import { Introduce } from "@/utils/model";

const PressCoverage = ({introduce} : {introduce: Introduce}) => {
  const [selectedNews, setSelectedNews] = useState(introduce.newsSection.news[0]);

  return (
    <div className="container mx-auto max-w-[1170px] px-4 md:px-8 lg:px-12 py-10">
      <h2 className="text-center text-2xl font-bold mb-8">
        {introduce.newsSection.title}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nội dung bài viết */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md relative">
          <iframe src={selectedNews.url} title="Bài báo" className="w-full h-[400px] rounded-lg" allowFullScreen></iframe>
        </div>

        {/* Danh sách logo báo chí */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-blue-700 mb-4 text-center">
            {introduce.newsSection.title}
          </h3>

          {/* PC View: Cuộn dọc */}
          <div className="hidden md:block overflow-y-auto max-h-[400px] pr-2">
            {introduce.newsSection.news.map((introduce, index) => (
              <div
                key={index}
                className={`p-4 cursor-pointer transition-all ${
                  selectedNews.logo === "logo.name" ? "bg-gray-300 rounded-lg" : ""
                }`}
                onClick={() => {
                  setSelectedNews(introduce);
                }}
              >
                <Image
                  src={introduce.logo}
                  alt={"Logo báo"}
                  width={150}
                  height={50}
                  className="mx-auto"
                />
              </div>
            ))}
          </div>

          {/* Mobile View: Slide ngang */}
          <div className="block md:hidden">
            <Swiper
              slidesPerView={2.5}
              spaceBetween={10}
              freeMode={true}
              pagination={{ clickable: true }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              {introduce.newsSection.news.map((introduce, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="p-2 cursor-pointer hover:opacity-80 transition duration-300"
                    onClick={() => {
                      setSelectedNews(introduce);
                    }}
                  >
                    <Image
                      src={introduce.logo}
                      alt={"Logo báo"}
                      width={120}
                      height={50}
                      className="mx-auto"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressCoverage;
