"use client";

import React from "react";
import Image from "next/image";
import { Blog } from "@/utils/model";

const ServiceItemDetail = ({blog} : {blog: Blog}) => {
    return (
        <div className="flex container mx-auto mt-40 mb-24 px-4 gap-10">
            {/* Thêm height vào container cha */}
            <div className="hidden md:block w-1/5">
                <div className="sticky top-36 overflow-hidden">
                    {blog.serviceItem?.bannerLeft && 
                        <Image 
                            src={blog.serviceItem?.bannerLeft} 
                            alt={"Banner trái"}
                            width={0} 
                            height={0} 
                            sizes="100vw"
                            className="w-full hover:scale-105 transition-all duration-300" 
                        />
                    }
                </div>
            </div>
        
            <div className="md:w-3/5 w-full">
                <h1 className="text-3xl font-bold uppercase text-blue-500 text-center">
                    {blog.title}
                </h1>
                <div 
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    className="prose max-w-none mt-10 [&_figcaption]:text-center"
                />
            </div>
        
            {/* Thêm height vào container cha */}
            <div className="hidden md:block w-1/5">
                <div className="sticky top-36 overflow-hidden">
                    {blog.serviceItem?.bannerRight && 
                        <Image 
                            src={blog.serviceItem?.bannerRight} 
                            alt={"Banner phải"}
                            width={0} 
                            height={0} 
                            sizes="100vw"
                            className="w-full hover:scale-105 transition-all duration-300" 
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default ServiceItemDetail;
