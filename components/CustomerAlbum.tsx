"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface CustomerAlbumProps {
  images: {
    title: string;
    images: string[];
  }
}

const CustomerAlbum = ({ images }: CustomerAlbumProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto max-w-[1170px] text-center">
        <h2 className="text-2xl font-bold mb-6 uppercase">{images.title}</h2>

        {/* Album */}
        <div className="relative">
          {/* Album Grid */}
          <div
            ref={scrollRef}
            className="lg:grid lg:grid-cols-5 lg:gap-4 flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ maxHeight: "420px" }}
          >
            {images.images.map((image, index) => (
              <div
                key={index}
                className="w-[150px] h-[200px] lg:w-auto lg:h-auto rounded-lg overflow-hidden shadow-md flex-shrink-0"
              >
                <Image
                  src={image}
                  alt={"Hình ảnh khách hàng"}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          {/* Nút cuộn trái (Mobile) */}
          <button
            onClick={scrollLeft}
            className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full shadow-md p-2 hover:bg-gray-100 z-10"
          >
            ◀
          </button>

          {/* Nút cuộn phải (Mobile) */}
          <button
            onClick={scrollRight}
            className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full shadow-md p-2 hover:bg-gray-100 z-10"
          >
            ▶
          </button>
        </div>

        {/* Nút xem thêm */}
        <div className="mt-6">
          <Link href={"/story"} className="mt- px-6 py-2 bg-pink-100 text-pink-600 rounded-full font-semibold hover:bg-pink-200">
            XEM THÊM
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomerAlbum;
