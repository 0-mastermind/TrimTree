"use client";
import ImageCropper from "@/components/ImageCropper";
import { Store } from "lucide-react";
import { redirect } from "next/navigation";

const page = () => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Add a new branch</h1>
        <button
          className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
          onClick={() => redirect("/dashboard/admin/branches")}>
          <Store className="h-4 w-4 md:h-5 md:w-5" /> View branches
        </button>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-1 md:order-2">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Branch Image</legend>
            <ImageCropper aspect={1 / 1} />
          </fieldset>
        </div>
        
        <div className="flex flex-col gap-2 order-2 md:order-1">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Branch Name</legend>
            <input
              type="text"
              className="input focus:outline-none w-full"
              placeholder="Branch One"
            />
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Address</legend>
            <input
              type="text"
              className="input focus:outline-none w-full"
              placeholder="Main Branch"
            />
          </fieldset>

          <div className="mt-2 mb-6">
            <button
              className="text-xs font-semibold cursor-pointer transition-all bg-green-600 text-white py-3 md:px-8 md:py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center justify-center w-full md:w-auto"
              onClick={() => redirect("/dashboard/admin/create-branch")}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;
