import { motion } from 'framer-motion';
import Image from 'next/image'; // Giả định bạn đang sử dụng Next.js

interface FeatureSectionProps {
    feature: {
        title: string;
        description: string;
        image: string;
    };
    index: number;
}

const FeatureSection = ({ feature, index } : FeatureSectionProps) => {
  // Hiệu ứng slide-in từ trái hoặc phải
  const slideInAnimation = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 }, // Slide từ trái hoặc phải
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <motion.div
      key={index}
      className="flex flex-col lg:flex-row items-center gap-10 mt-10"
      initial="hidden" // Trạng thái ban đầu
      whileInView="visible" // Khi phần tử xuất hiện trong viewport
      viewport={{ once: false }} // Chỉ kích hoạt một lần
      variants={slideInAnimation} // Áp dụng hiệu ứng
    >
      {/* Nội dung */}
      <div
        className={`lg:w-1/2 text-center ${
          index % 2 !== 0 ? 'lg:order-2' : ''
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 uppercase">{feature.title}</h2>
        <p className="text-gray-600 leading-7">{feature.description}</p>
      </div>

      {/* Hình ảnh */}
      <div
        className={`lg:w-1/2 ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
      >
        <Image
          src={feature.image}
          alt={feature.title}
          width={600}
          height={400}
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>
    </motion.div>
  );
};

export default FeatureSection;