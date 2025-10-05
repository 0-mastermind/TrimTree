"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Branch } from "@/types/global";
import { getAllBranches } from "@/utils/api/branches";
import { Store, UserPlus } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const ViewBranches = () => {
  const dispatch = useAppDispatch();
  const { branches } = useAppSelector((state) => state.branches);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const redirectToURI = (url: string) => {
    redirect(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllBranches());

        // if (res) {
        //   setIsLoading(false);
        // }
      } catch (error) {
        console.error("Error! while fetching the branches data", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div>
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-semibold">Your Branches</h1>
          <div className="flex gap-2">
            <button
              className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
              onClick={() => redirectToURI("/dashboard/admin/create-branch")}>
              <Store className="h-4 w-4 md:h-5 md:w-5" />{" "}
              <span className="hidden md:block">Add a branch</span>
            </button>

            <button
              className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
              onClick={() => redirectToURI("/dashboard/admin/add-employee")}>
              <UserPlus className="h-4 w-4 md:h-5 md:w-5" />{" "}
              <span className="hidden md:block">Add an employee</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-10">
        {/* Card */}
        {branches &&
          branches.map((item: Branch) => {
            return (
              <div
                onClick={() =>
                  redirectToURI(`/dashboard/admin/branches/${item.name}?id=${item._id}`)
                }
                key={item._id}
                className="w-full max-w-md rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer">
                <div className="flex-shrink-0">
                  <Image
                    src={item.branchImage.url}
                    alt="Store illustration"
                    height={100}
                    width={100}
                    className="rounded-lg aspect-square"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-semibold capitalize text-gray-800">
                    {item.name}
                  </h1>
                  <p className="text-sm text-gray-500 capitalize">{item.address}</p>

                  <button
                    className="text-xs mt-4 cursor-pointer transition-all bg-black/75 text-white px-6 py-2 rounded-lg border-black border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] max-w-[200px]"
                    onClick={() =>
                      redirectToURI(`/dashboard/admin/branches/${item._id}`)
                    }>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ViewBranches;
