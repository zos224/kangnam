"use client";

import { useState } from "react";
import Image from "next/image";
import { useDoctorData } from "@/hooks/useDoctorData";
import { Doctor } from "@/utils/model";

const DoctorsTeam = () => {
  const {departments, loading} = useDoctorData();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <div className="container mx-auto mt-10 mb-24 px-4 max-w-[1170px]">
      {/* Tab navigation */}
      <div className="flex space-x-4 overflow-x-auto justify-center pb-4 border-b border-gray-300 scrollbar-hide">
        {departments.map((department, index) => (
          <button
            key={index}
            className={`py-2 px-6 rounded-full text-lg font-semibold transition-all duration-300 whitespace-nowrap ${
              selectedCategory === index ? "bg-black text-white shadow-lg" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(index)}
          >
            {department.name}
          </button>
        ))}
      </div>

      {/* Doctor list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {departments[selectedCategory]?.workLite.map((workLite, index) => (
          <div
            key={index}
            className="shadow-xl rounded-lg overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:shadow-2xl cursor-pointer"
            onClick={() => setSelectedDoctor(workLite.doctor)}
          >
            <Image
              src={workLite.doctor.img}
              alt={workLite.doctor.name}
              width={268}
              height={334}
              className="w-full h-auto object-cover"
            />
            <div className="p-2 text-center flex justify-between items-center">
              <div>
                <p className="text-sm text-yellow-500 mt-2 uppercase font-bold text-left">{workLite.doctor.title}</p>
                <h3 className="text-lg font-bold text-gray-900 uppercase text-left">{workLite.doctor.name}</h3>
              </div>
              <div className="w-14 h-14 border border-black bg-gray-100 text-gray-700 rounded-full inline-flex items-center justify-center text-xs font-medium">
                {workLite.doctor.exp} Năm
              </div>
            </div>
            <div className="border-t border-gray-200 p-2 text-center uppercase text-sm text-gray-700">
              {workLite.doctor.position}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor detail modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh] p-6">
            <button
              className="absolute top-4 right-4 text-gray-700 font-bold text-2xl"
              onClick={() => setSelectedDoctor(null)}
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              <Image
                src={selectedDoctor.img}
                alt={selectedDoctor.name}
                width={268}
                height={334}
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 uppercase">{selectedDoctor.name}</h3>
                <p className="text-gray-600 mt-2 text-lg font-semibold uppercase">{selectedDoctor.title + " - " + selectedDoctor.position}</p>
                <p className="text-gray-700 mt-4 leading-7">{selectedDoctor.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsTeam;
