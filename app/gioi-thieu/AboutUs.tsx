"use client";

import FeatureSection from "@/components/FeatureSection";
import { Introduce } from "@/utils/model";
import Image from "next/image";

const AboutPage = ({introduce} : {introduce: Introduce}) => {
  return (
    <div className="container max-w-[1170px] mx-auto px-4 md:px-8 lg:px-12 py-10 space-y-16 md:mt-40">
      {/* Tiêu đề chính */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase">
          {introduce.title}
        </h1>
        <div className="w-20 h-[3px] bg-gray-800 mx-auto mt-3"></div>
      </div>

      {/* Banner hình ảnh lớn */}
      <div className="w-full mx-auto">
        <Image
          src={introduce.banner || ""}
          alt="Hệ thống Bệnh viện Kangnam"
          width={1170}
          height={500}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>

      {/* Đoạn giới thiệu */}
      <div className="text-center text-lg text-gray-700 leading-7 max-w-3xl mx-auto">
        {introduce.description1}
      </div>

      <div>
        {introduce.features.map((feature, index) => (
          <FeatureSection feature={feature} key={index} index={index}/>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
