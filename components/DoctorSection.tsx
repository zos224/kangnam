"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Doctor } from "@/utils/model";

interface DoctorSectionProps {
  doctors: Array<Doctor>;
}

const DoctorSection = ({ doctors }: DoctorSectionProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần bên trái */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between h-[550px]">
          <Image
            src={selectedDoctor.img}
            alt={selectedDoctor.name}
            width={385}
            height={480}
            className="w-full h-[300px] object-contain rounded-md mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-2 uppercase">
            {selectedDoctor.name}
          </h2>
          <h3 className="text-lg text-blue-600 font-semibold mb-4">
            {selectedDoctor.title}
          </h3>
          <div className="bg-blue-100 p-4 rounded-lg overflow-y-auto">
            {selectedDoctor.description.split('\n').map((item, index) => (
              <p key={index} className="text-gray-700 text-sm mb-2">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Phần bên phải */}
        <div className="bg-white rounded-lg shadow-lg overflow-y-auto h-[550px]">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              className={`flex items-center p-4 cursor-pointer transition ${
                selectedDoctor.id === doctor.id
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-gray-800 hover:bg-blue-200"
              } mb-2 mx-2 rounded-lg`}
            >
              <Image
                src={doctor.img}
                alt={doctor.name}
                width={385}
                height={480}
                className="w-10 h-10 object-cover rounded-full mr-4 border border-white"
              />
              <div>
                <h4 className="text-sm font-bold leading-tight  uppercase">
                  {doctor.name}
                </h4>
                <p className="text-xs leading-tight uppercase">{doctor.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
