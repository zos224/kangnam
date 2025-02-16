"use client";

import { Introduce } from "@/utils/model";
import Image from "next/image";

const CampaignSection = ({introduce} : {introduce: Introduce}) => {
  const fetchBlog = async (id: number) => {
    try {
      const res = await fetch('/api/blog/' + id);
      const data = await res.json();
      return data.slug;
    } catch (error) {
      console.error('Failed to fetch blog data:', error);
    }
  };
  return (
    <div className="container mx-auto max-w-[1170px] px-4 md:px-8 lg:px-12 py-10 flex flex-col lg:flex-row items-center gap-10">
      {/* Text content */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <p className="text-gray-700 leading-7 mb-6">
          {introduce.beautySection.description}
        </p>

        <ul className="space-y-4 text-left">
          {introduce.beautySection.contents.map((content, index) => (
            <li key={index} className="flex justify-between items-center border-b border-gray-300 pb-2">
              <span className="font-bold text-lg text-gray-900">{content.title}</span>
              <a href={"/bai-viet/" + fetchBlog(content.idBlog)} className="text-blue-600 hover:text-blue-800 text-sm">
                Xem chi tiết →
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Image */}
      <div className="lg:w-1/2">
        <Image
          src="/images/img-1.webp"
          alt="Hành trình lột xác"
          width={500}
          height={400}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>
    </div>
  );
};

export default CampaignSection;
