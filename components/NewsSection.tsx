"use client";

import React from "react";
import Image from "next/image";
import { Blog } from "@/utils/model";
import Link from "next/link";

const NewsSection = ({blogs} : {blogs: Blog[]}) => {

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-8">TIN TỨC</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={300} 
                height={169}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <div className="mt-2 text-gray-700 line-clamp-6" dangerouslySetInnerHTML={{ __html: item.content }}></div>
                <Link
                  href={"/bai-viet/" + item.slug}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href={"/tin-tuc/" + blogs[0].blogType.slug} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Xem thêm tin
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
