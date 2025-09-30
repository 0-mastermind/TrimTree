"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Staff } from "@/types/global";
import { getBranchEmployees } from "@/utils/api/staff";
import Image from "next/image";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const dispatch = useAppDispatch();
  const { branchStaff } = useAppSelector((state) => state.branches);
  const branchId = useSearchParams().get("id");
  const router = useRouter();

  const redirectToURI = (url: string) => {
    redirect(url);
  };

  useEffect(() => {
    // const isPermitted = !branchId && !branchStaff;
    console.log(branchId, branchStaff);
    console.log(branchId === null && !branchStaff);
    // if (!isPermitted) return router.push("/dashboard/admin/branches");
  }, [branchStaff]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        if (!branchId) return;

        // fetching the employees data
        await dispatch(getBranchEmployees(branchId!));
      } catch (error) {
        console.error("Error! while fetching staff data", error);
      }
    };

    fetchStaffData();
  }, []);

  return (
    <div className="mt-6">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-semibold">Your Employees</h1>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {branchStaff &&
          branchStaff.map((item: Staff) => {
            return (
              <div key={item._id} className="mt-8 flex flex-wrap gap-10">
                <div
                  onClick={() =>
                    redirectToURI(
                      `/dashboard/admin/branches/${item.userId.branch.name}/${item.userId.name}?id=${item._id}`
                    )
                  }
                  className="w-full max-w-md rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center gap-4 p-4 cursor-pointer">
                  <div className="flex-shrink-0">
                    {item.userId?.image ? (
                      <Image
                        src={item.userId?.image.url}
                        alt="Store illustration"
                        height={100}
                        width={100}
                        className="rounded-lg aspect-square object-cover"
                        priority={true}
                      />
                    ) : (
                      <Image
                        src={"/user.png"}
                        alt="Store illustration"
                        height={100}
                        width={100}
                        className="rounded-lg aspect-square"
                        priority={true}
                      />
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <h1 className="text-lg md:text-xl font-semibold capitalize text-gray-800">
                      {item.userId.name}
                    </h1>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      artist
                    </p>

                    <button
                      className="text-xs mt-4 cursor-pointer transition-all bg-black/75 text-white px-6 py-2 rounded-lg border-black border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                      onClick={() =>
                        redirectToURI(
                          `/dashboard/admin/branches/${item.userId.branch.name}/${item.userId.name}?id=${item._id}`
                        )
                      }>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default page;
