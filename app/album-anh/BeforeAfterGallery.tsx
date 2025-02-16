"use client";

import { useState } from "react";
import Image from "next/image";
import { useAlbumData } from "@/hooks/useAblumData";

const BeforeAfterGallery = () => {
  const { albumData, loading } = useAlbumData();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  return (
    loading ? (
      <div role="status" className="flex justify-center items-center mt-50">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
    )
    : (
    <div className="container mx-auto mt-36 mb-36 px-4 max-w-[1170px]">
      {/* Mobile Tabs */}
      <div className="lg:hidden flex flex-wrap gap-2 mb-6 justify-center">
        {albumData.map((service, index) => (
          <button
            key={index}
            className={`py-2 px-4 rounded-full text-sm font-semibold ${
              index === selectedCategory
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-blue-100"
            }`}
            onClick={() => setSelectedCategory(index)}
          >
            {service.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar for Desktop */}
        <aside className="lg:col-span-1 border-r pr-4 hidden lg:block">
          <ul className="space-y-2">
            {albumData.map((service, index) => (
              <li
                key={index}
                className={`cursor-pointer p-3 rounded-md text-lg ${
                  selectedCategory === index ? "bg-blue-200 font-bold" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(index)}
              >
                {service.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">
          <h2 className="text-3xl font-bold text-center">{albumData[selectedCategory].name}</h2>
          <p className="text-center text-gray-600 mt-2">{albumData[selectedCategory].description}</p>

          <div className="mt-8">
            {albumData[selectedCategory].serviceItems.map((serviceItem, index) => (
              <div key={index} className="mb-12">
                <h3 className="text-2xl font-semibold text-center mb-4">{serviceItem.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceItem.imgCustomer.map((image, imgIndex) => (
                    <div key={imgIndex} className="shadow-lg rounded-lg overflow-hidden">
                      <Image src={image} alt={"Hình ảnh khách hàng"} width={410} height={287} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div> )
  );
};

export default BeforeAfterGallery;
