"use client"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleDetail from "./ArticleDetail";
import ArticleInteraction from "@/components/ArticleInteraction";
import FooterAction from "@/components/FooterAction";
import { use } from "react";
import { useBlogDetailData } from "@/hooks/useBlogDetailData";



export default function ArticleDetails({params}: {params: Promise<{slug: string}>}) {
  const paramData = use(params);
  const {blog, top10, bannerBlog, loading } = useBlogDetailData({ slug: paramData.slug });
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content */}
      {bannerBlog && blog && <ArticleDetail banner={bannerBlog} blog={blog} top10={top10}/> }
      <ArticleInteraction/>
      {/* Footer */}
      <Footer />
    {/* Hiển thị FooterActions chỉ trên thiết bị di động */}
          <div className="block md:hidden">
            <FooterAction />
          </div>
        </div>
      );
  }
