"use client";

import { useState } from "react";
import Image from "next/image";
import { usePriceData } from "@/hooks/usePriceData";

const PricingPage = () => {
  const { priceData, loading } = usePriceData();
  const [selectedService, setSelectedService] = useState<number>(0);
  return (
    loading ? (
      <div role="status" className="flex justify-center items-center mt-50">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
    ) : (
    <div className="container mx-auto mt-36 mb-36 px-4 max-w-[1170px]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 border-r pr-4">
          <ul className="hidden lg:block space-y-2">
            {priceData.map((service, index) => (
              <li
                key={index}
                className={`cursor-pointer p-3 rounded-md ${
                  selectedService === index ? "bg-blue-200 font-bold" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedService(index)}
              >
                {service.name}
              </li>
            ))}
          </ul>

          {/* Mobile layout */}
          <div className="lg:hidden flex flex-wrap gap-2 justify-center">
            {priceData.map((service, index) => (
              <button
                key={index}
                onClick={() => setSelectedService(index)}
                className={`px-4 py-2 text-sm rounded-full ${
                  selectedService === index ? "bg-blue-500 text-white font-bold" : "bg-gray-200 text-gray-700"
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3 text-center">
          <h2 className="text-3xl font-bold text-black">{priceData[selectedService].name}</h2>
          <p className="text-gray-600 mt-2">{priceData[selectedService].descriptionPrice}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {priceData[selectedService].priceSheets?.map((item, index) => (
              <div key={index} className="shadow-lg rounded-lg overflow-hidden bg-gray-100">
                <Image src={item.image || ""} alt={item.name} width={410} height={287} className="w-full h-auto" />
                <div className="p-4 bg-gray-200">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-700">{item.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-500 italic mt-6">
            Trên đây là giá niêm yết của các dịch vụ chính. Quý khách vui lòng đăng ký thông tin để nhận ưu đãi hấp dẫn.
          </p>
          <div className="mt-6">
            <button className="bg-pink-500 text-white py-3 px-6 rounded-full font-bold hover:bg-pink-600 transition">
              ƯU ĐÃI HOT - NHẬN NGAY
            </button>
          </div>
        </main>
      </div>
    </div>)
  );
};

export default PricingPage;
