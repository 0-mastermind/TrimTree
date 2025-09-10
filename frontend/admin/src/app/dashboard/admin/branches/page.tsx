"use client";
import { storesData } from "@/data/data";
import { StoreData } from "@/types/global";
import { Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  const redirectToURI = (url: string) => {
    redirect(url);
  };

  return (
    <div>
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-semibold">Your Branches</h1>
          <Link
            href="/dashboard/admin/branches/add-branch"
            className="flex gap-2 px-2 md:px-6 py-2 rounded-md bg-green-600 hover:bg-green-700/90 items-center justify-center text-white/90 transition-all duration-75 md:text-md text-sm">
            <Store className="h-4 w-4 md:h-5 md:w-5" /> Add a new store
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-10">
        {/* Card */}
        {storesData.map((item: StoreData) => {
          return (
            <div
              onClick={() => redirectToURI("/")}
              key={item.branchName}
              className="w-full max-w-md rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer">
              <div className="flex-shrink-0">
                <Image
                  src={item.branchImage}
                  alt="Store illustration"
                  height={100}
                  width={100}
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-semibold capitalize text-gray-800">
                  {item.branchName}
                </h1>
                <p className="text-sm text-gray-500">{item.address}</p>

                <Link
                  href={item.branchURL}
                  className="text-xs mt-4 py-2 px-2 bg-black/80 text-center text-white rounded-md">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
