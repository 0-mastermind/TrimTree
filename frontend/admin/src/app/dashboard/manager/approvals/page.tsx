"use client";
import ApprovalCard from "@/components/Manager/ApprovalCard";
import { CircleCheck } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <button
          className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
          onClick={() => redirect("/dashboard/manager/set-holiday")}>
          <CircleCheck className="h-4 w-4 md:h-5 md:w-5" /> Set Holiday
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 pt-6 gap-8">
        <ApprovalCard />
        <ApprovalCard />
        <ApprovalCard />
      </div>
    </div>
  );
};

export default page;
