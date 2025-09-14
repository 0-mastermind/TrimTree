"use client";
import { Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = () => {
  const redirectToURI = (url: string) => {
    redirect(url);
  };

  return (
    <div className="mt-6">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-semibold">Your Employees</h1>
            <button
              className="text-xs mt-4 cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
              onClick={() =>
                redirectToURI("/dashboard/admin/branches/branch-1/add-branch")
              }>
             <Store className="h-4 w-4 md:h-5 md:w-5" /> Add an employee
            </button>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-10">
        <div
          onClick={() =>
            redirectToURI("/dashboard/admin/branches/branch-1/user")
          }
          className="w-full max-w-md rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer">
          <div className="flex-shrink-0">
            <Image
              src={"/user.png"}
              alt="Store illustration"
              height={100}
              width={100}
              className="rounded-lg"
              priority={true}
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-semibold capitalize text-gray-800">
              Employee Name
            </h1>
            <p className="text-sm text-gray-500 capitalize mt-1">artist</p>

            <button
              className="text-xs mt-4 cursor-pointer transition-all bg-black/75 text-white px-6 py-2 rounded-lg border-black border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              onClick={() =>
                redirectToURI("/dashboard/admin/branches/branch-1/user")
              }>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
