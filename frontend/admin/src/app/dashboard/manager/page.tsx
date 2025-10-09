"use client";
import DetailsToday from "@/components/Manager/DetailsToday";
import Image from "next/image";
import React from "react";

const page = () => {
  

  return (
    <div className="mt-6">
      <div className="flex gap-5 items-center">
        <Image src="/store.svg" alt="store image" height={100} width={100} />
        <div>
          <h3 className="font-bold flex text-2xl">Branch One</h3>
          <p className="text-gray-400">Main Branch</p>
        </div>
      </div>
      <DetailsToday />
    </div>
  );
};

export default page;
