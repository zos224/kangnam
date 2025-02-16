"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SliderProps {
  slides: Array<{
    image: string;
    alt: string;
  }>;
}

const Slider = ({ slides }: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateScreenSize(); // Check initial screen size
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${
        isMobile ? "h-[56vw]" : "h-screen"
      }`}
      style={{
        marginTop: "0", // Đẩy xuống để không bị header che
        position: "relative", // Giữ dots nằm trong slider
      }}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <Image
            key={index}
            src={slide.image}
            alt={"banner"}
            width={1920}
            height={1080}
            className={`w-full object-${isMobile ? "cover" : "fill"}`}
            style={{ height: isMobile ? "56vw" : "95vh" }}
          />
        ))}
      </div>

      {/* Navigation Dots */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
        style={{
          bottom: "10%", // Đặt dots cao hơn để nằm trong slider
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>

      {/* Arrows */}
      {!isMobile && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            onClick={prevSlide}
          >
            &#8249;
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
            onClick={nextSlide}
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

export default Slider;
