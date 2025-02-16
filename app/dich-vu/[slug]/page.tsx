"use client"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import FooterAction from "@/components/FooterAction";
import { use, useState } from "react";
import { useServiceDetailData } from "@/hooks/useServiceDetailData";
import FeatureSection from "@/components/FeatureSection";
import Link from "next/link";

export default function DichVu ({params}: {params: Promise<{slug: string}>}) {
  const slug = use(params);
  const { serviceDetailData, loading } = useServiceDetailData(slug);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  return (
    loading ? (
      <div role="status" className="flex justify-center items-center mt-50">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>
    ) : (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="container mx-auto max-w-[1200px] px-4 py-16 pt-[120px] mt-10">
        {/* Section Content */}
        <div className={`grid grid-cols-1 ${serviceDetailData?.content.videos.length === 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-12 items-center`}>
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-black uppercase leading-tight text-center">
              {serviceDetailData?.content.fullTitle}
            </h2>
            <div className="w-24 h-1 bg-black my-6 mx-auto"></div>
            <p className="text-lg text-center">{serviceDetailData?.content.introduction}</p>
          </div>
          {/* Video Content */}
          {serviceDetailData?.content.videos.length === 1 ? (
            <div className="relative">
              <iframe src={serviceDetailData?.content.videos[0]} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {serviceDetailData?.content.videos.map((video, index) => (
                <div key={index} className="relative">
                  <iframe src={video} onClick={() => setSelectedVideo(video)} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {serviceDetailData?.serviceItems.map((service, index) => (
              <div key={index} className="relative">
                <div className="overflow-hidden rounded-t-lg">
                  <Image
                    src={service.img}
                    alt={service.name}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className="w-full h-72 object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center bg-blue-200 p-5">
                  <h3 className="text-lack text-lg font-bold uppercase mb-3">{service.name}</h3>
                  <Link className="underline underline-offset-4 hover:text-yellow-600" href={"/dich-vu/" + slug.slug + "/" + service.blog.slug}>
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <Image width={0} height={0} sizes='100vw' src={serviceDetailData?.content.banner || ""} alt={serviceDetailData?.name || ""} className="w-full h-100 object-cover" />
        </div>
        <div>
          {
            serviceDetailData?.content.features.map((feature, index) => (
              // <div key={index} className="flex flex-col lg:flex-row items-center gap-10 mt-10">
              //   <div className={`lg:w-1/2 text-center lg:text-left ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
              //     <h2 className="text-2xl font-bold mb-4 uppercase">{feature.title}</h2>
              //     <p className="text-gray-600 leading-7">
              //       {feature.description}
              //     </p>
              //   </div>
              //   <div className={`lg:w-1/2 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
              //     <Image src={feature.image} alt={feature.title} width={600} height={400} className="rounded-lg shadow-lg w-full h-auto" />
              //   </div>
              // </div>
              <FeatureSection feature={feature} key={index} index={index}/>
            ))
          }
        </div>
        <div className="mt-10">
          <div className="uppercase font-bold text-2xl text-center">{serviceDetailData?.content.resultTitle}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 "> 
            {serviceDetailData?.serviceItems.map((result, index) => (
              index <= 3 && <div key={index} className="relative">
                <Image src={result.img} alt={result.name} width={0} height={0} sizes="100vw" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>


        {/* Video Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
              <button
                className="absolute top-2 right-2 text-gray-700 text-2xl font-bold"
                onClick={() => setIsPopupOpen(false)}
              >
                ✕
              </button>
              <iframe
                className="w-full h-[400px] rounded-lg"
                src={selectedVideo}
                title="Chuyên khoa mắt Kangnam"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
    </div>
      {/* Footer */}
      <Footer />
      <div className="block md:hidden">
        <FooterAction />
      </div>
    </div>
      )
    )
}
