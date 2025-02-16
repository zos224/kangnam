"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Blog } from "@/utils/model";
import Link from "next/link";

const ArticleDetail = ({blog, top10, banner} : {blog: Blog, top10: Blog[], banner: string}) => {
  const [toc, setToc] = useState<{id: string; text: string}[]>([]);

  useEffect(() => {
    if (blog.content) {
      // Create a temporary div to parse HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      
      // Get all heading elements
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // Convert NodeList to array of heading objects
      const tocItems = Array.from(headings).map(heading => {
        // Create id from heading text
        const id = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || '';
        
        // Set id attribute on heading element in content
        heading.id = id;
        
        return {
          id,
          text: heading.textContent || ''
        };
      });

      setToc(tocItems);
      
      // Update the content with new heading IDs
      blog.content = tempDiv.innerHTML;
    }
  }, [blog.content]);

  return (
    <div className="container mx-auto mt-28 mb-24 px-4 max-w-[1170px]">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 mt-4">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">Cập nhật: {new Date(blog.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} - Tác giả: {blog.author.name} {blog.doctor ? " - Bác sĩ tư vấn: " + blog.doctor.name  : ""}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nội dung bài viết */}
        <div className="lg:col-span-2 space-y-8">
          {/* TOC Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Nội dung chính</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {toc.map((item, index) => (
                <li key={index}>
                  <a 
                    href={`#${item.id}`} 
                    className="hover:text-blue-600 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Article content */}
          <div 
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="prose max-w-none [&_figcaption]:text-center"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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

export default ArticleDetail;
