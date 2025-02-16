"use client";

import { HomeContent } from "@/utils/model";
import React, { useEffect } from "react";

// BannerSection là một section độc lập
const BannerSection = () => {
  const [homeContent, setHomeContent] = React.useState<HomeContent | null>(null);
  
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const idLanguage = localStorage.getItem("currentLang")
        const res = await fetch("/api/home-content?idLanguage=" + idLanguage);
        const data = await res.json();
        setHomeContent(data);
      } catch (error) {
        console.error("Failed to fetch home content:", error);
      }
    };

    fetchHomeContent();
  } , []);
  return (
    <section
      className="relative bg-cover bg-center text-white mt-28"
      style={{ backgroundImage: `url(${homeContent?.doiNguBacSi.banner.replaceAll("\\", "/")})`, height: "500px" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto h-full flex items-center">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4 uppercase">{homeContent?.doiNguBacSi.title}</h2>
          <p>
            {homeContent?.doiNguBacSi.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
