"use client";

import React, { useState } from "react";
import Image from "next/image";

const ArticleInteraction = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted comment:", comment);
    setComment(""); // Clear comment after submission
  };

  return (
    <div className="container mx-auto max-w-[1170px] mt-12 px-4">
      {/* Register Button */}
      <div className="text-center">
        <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all">
          ĐĂNG KÝ NGAY
        </button>
      </div>

      {/* Rating Section */}
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center gap-1 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer ${
                rating >= star ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <p className="mt-2 text-gray-600">Hãy là người đầu tiên đánh giá bài viết này.</p>
      </div>

      {/* Banner Section */}
      <div className="mt-8">
        <Image
          src="/images/desktop.jpg"
          alt="Website Hỏi Đáp"
          className="w-full rounded-lg shadow-md"
          width={1522}
          height={627}

        />
      </div>

      {/* Service Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        {[
          { title: "NHẬN BÁO GIÁ", btnText: "Nhận ngay", icon: "📄" },
          { title: "ĐẶT LỊCH TƯ VẤN", btnText: "Tư vấn ngay", icon: "📅" },
          { title: "ƯU ĐÃI HOT", btnText: "Nhận ngay", icon: "🎁" },
        ].map((item, index) => (
          <div key={index} className="text-center space-y-2">
            <div className="text-4xl">{item.icon}</div>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition-all">
              {item.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* Comment Section */}
      <div className="mt-8">
        <h3 className="text-gray-800 font-semibold mb-2">
          Hãy để lại bình luận của bạn bên dưới!
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mời bạn để lại bình luận"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          ></textarea>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              GỬI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleInteraction;
