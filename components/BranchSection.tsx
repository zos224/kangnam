"use client";

import { Branch } from "@/utils/model";
import Link from "next/link";
import React from "react";
import { FaPlus, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const BranchSection = ({branchs} : {branchs: Branch[]}) => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold mb-8">HỆ THỐNG CHI NHÁNH</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branchs.map((branch) => (
            <div
              key={branch.id}
              className="flex items-center justify-between p-4 bg-white border rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 text-white rounded-full">
                  <FaPlus size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{branch.name}</h3>
                  <p className="text-gray-600 text-sm">{branch.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={branch.ggmap} target="_blank">
                  <FaMapMarkerAlt size={20} className="text-gray-600 cursor-pointer hover:text-black" />
                </Link>
                <FaPhoneAlt size={20} className="text-gray-600 cursor-pointer hover:text-black" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchSection;
