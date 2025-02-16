"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog, BlogType } from "@/utils/model";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const BrandNews = ({
  blogType,
  top10,
  banner,
  currentPage,
  totalPages,
  onPageChange
}: {
  blogType: BlogType;
  top10: Blog[];
  banner: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="container mx-auto mt-28 mb-24 px-4 max-w-[1170px]">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 uppercase mt-4">
        {blogType.name}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách tin tức chính */}
        <div className="lg:col-span-2 space-y-6">
          {blogType.blogs.map((article, index) => (
            <Link key={index} href={"/bai-viet/" + article.slug} className="block">
              <div className="flex flex-col md:flex-row gap-4 shadow-md rounded-lg overflow-hidden bg-white hover:shadow-xl transition">
                <Image src={article.img} alt={article.title} width={300} height={169} className="w-full md:w-1/3 h-40 object-cover rounded-lg" />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-blue-700 hover:underline cursor-pointer">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm">Cập nhật: {new Date(article.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} - Tác giả: {article.author.name}</p>
                  <div className="mt-2 text-gray-700 line-clamp-4" dangerouslySetInnerHTML={{ __html: article.content }}></div>
                </div>
              </div>
            </Link>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        {/* Cột bên phải */}
        <div className="space-y-6">
          {/* Hành trình lột xác */}
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-blue-700 mb-4">HÀNH TRÌNH LỘT XÁC MÙA 6</h3>
            <div className="space-y-4">
              {popularArticles.slice(0, 3).map((story, index) => (
                <a key={index} href={story.link} className="flex gap-4 items-center">
                  <Image src={story.image} alt={story.title} width={115} height={65} className="w-16 h-16 object-cover rounded-lg" />
                  <p className="text-gray-900 text-sm hover:text-blue-600 cursor-pointer">{story.title}</p>
                </a>
              ))}
            </div>
          </div> */}

          {/* Banner quảng cáo */}
          <Image src={banner} alt="Lột xác Kangnam" width={0} height={0} sizes="100vw" className="w-full aspect-[9/16] rounded-lg shadow-lg" />

          {/* Bài viết được quan tâm */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-blue-700 mb-4">BÀI VIẾT ĐƯỢC QUAN TÂM</h3>
            <div className="space-y-4">
              {top10.map((article, index) => (
                <Link key={index} href={"/bai-viet/" + article.slug} className="flex gap-4 items-center">
                  <Image src={article.img} alt={article.title} width={0} height={0} sizes="100vw" className="w-1/2 object-cover rounded-lg" />
                  <p className="text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-4">{article.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandNews;
