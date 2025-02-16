"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useDepartmentsData } from "@/hooks/useDepartmentData";
import Link from "next/link";

const ServiceSlider = () => {
  const {departments, loading} = useDepartmentsData();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full bg-white py-10">
      <h2 className="text-center text-3xl font-bold mb-8">HỆ THỐNG CHUYÊN KHOA</h2>
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {departments.map((department, index) => (
            <div key={index} className="px-3">
              <div className="relative rounded-lg shadow-lg overflow-hidden flex">
                {/* Cột ảnh */}
                <div className="w-1/2">
                  <Image
                    src={department.img}
                    alt={department.name}
                    className="w-full h-full object-cover rounded-l-lg"
                    width={302}
                    height={277}
                  />
                </div>
                {/* Cột nội dung */}
                <div className={"w-1/2 flex flex-col justify-center items-center text-center p-6 rounded-r-lg" + (index % 2 === 0 ? " bg-yellow-100" : " bg-blue-100")}>
                  <p className="text-xs font-semibold uppercase text-gray-700">
                    {"CHUYÊN KHOA"}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mt-2">
                    {department.name}
                  </h3>
                  <Link href={"/bai-viet/" + department.blog.slug}>
                    <button className="mt-4 border border-black rounded-full px-4 py-1 text-sm flex items-center gap-2 hover:bg-black hover:text-white transition">
                      Xem thêm
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ServiceSlider;
