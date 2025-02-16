"use client";

import React, { useEffect, useState } from "react";
import { Show } from "@/utils/model";

const KangnamTV = ({ shows }: {shows: Show[]}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<Show>()
  useEffect(() => {
    setCurrentContent(shows[activeTab])
  }, [activeTab])


  return (
    currentContent && <section className="bg-white py-10">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center">KANGNAM TV</h2>
        <div className="flex justify-center space-x-4">
          {shows.map((show, index) => (
            <button
              key={show.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 ${activeTab === index ? 'text-blue-500' : ''}`}
            >
              {show.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded min-h-[250px] flex items-center">
            <p className="text-gray-700">{currentContent.description}</p>
          </div>

          <div className="relative min-h-[250px]">
            <iframe
              src={shows[activeTab].urlVideos[0]}
              title="Main Video"
              className="rounded shadow-lg object-cover w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4">
            {shows[activeTab].urlVideos.map((video, index) => (
              index > 0 &&
                <div
                  key={index}
                  className="w-48 flex-shrink-0 cursor-pointer"
                  onClick={() => setModalVideo(video)}
                >
                  <iframe
                    src={shows[activeTab].urlVideos[0]}
                    title="Video"
                    className="rounded shadow-lg object-cover w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
            ))}
          </div>
        </div>

        {modalVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-700 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                onClick={() => setModalVideo(null)}
              >
                ✕
              </button>
              <iframe
                src={modalVideo}
                title="Modal Video"
                className="rounded w-full h-64 md:h-96"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KangnamTV;
