"use client";

import React from "react";

const BannerTwoSection = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div
          className="relative bg-cover bg-center rounded-lg shadow-lg text-center"
          style={{ backgroundImage: "url('/images/banner.jpg')", height: "300px" }}
        >
          <div className="absolute inset-0 bg-white bg-opacity-50 flex flex-col justify-center items-start px-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 self-end">KANGNAM HẢI NGOẠI</h2>
            <button className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition self-end">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerTwoSection;
