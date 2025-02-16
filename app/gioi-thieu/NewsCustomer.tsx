"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Introduce } from "@/utils/model";

const CustomerSuccess = ({introduce} : {introduce: Introduce}) => {
  return (
    <div className="w-full bg-white py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">
          {introduce.customers.title}
        </h2>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        }}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full"
      >
        {introduce.customers.list.map((customer, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col h-full shadow-lg rounded-lg overflow-hidden bg-white">
              <div className="relative w-full h-[450px]">
                <Image
                  src={customer.image}
                  alt={customer.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6 bg-gray-100 flex-grow flex flex-col justify-between min-h-[250px]">
                <p className="text-sm text-gray-500 font-bold uppercase">{customer.position}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{customer.name}</h3>
                <p className="text-gray-700 leading-6">{customer.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerSuccess;
