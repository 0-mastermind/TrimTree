"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Staff } from "@/types/global";
import { getBranchEmployees } from "@/utils/api/staff";
import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ViewBranchDetails = () => {
  const dispatch = useAppDispatch();
  const { branchStaff } = useAppSelector((state) => state.branches);
  const branchId = useSearchParams().get("id");
  const [isLoading, setIsLoading] = useState(true);

  const redirectToURI = (url: string) => {
    redirect(url);
  };

  useEffect(() => {
    // const isPermitted = !branchId && !branchStaff;
    // if (!isPermitted) return router.push("/dashboard/admin/branches");
  }, [branchStaff, branchId]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setIsLoading(true);
        if (!branchId) return;

        await dispatch(getBranchEmployees(branchId!));
      } catch (error) {
        console.error("Error! while fetching staff data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [dispatch, branchId]);

  const handleEmployeeClick = (item: Staff) => {
    redirectToURI(
      `/dashboard/admin/branches/${item.userId.branch.name}/${item.userId.name}?id=${item._id}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Your Employees
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {branchStaff?.length || 0} employee
            {branchStaff?.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-9 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!branchStaff || branchStaff.length === 0) && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Employees Found
              </h3>
              <p className="text-gray-600">
                There are no employees assigned to this branch yet.
              </p>
            </div>
          </div>
        )}

        {/* Employee Grid */}
        {!isLoading && branchStaff && branchStaff.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {branchStaff.map((item: Staff) => (
              <div
                key={item._id}
                onClick={() => handleEmployeeClick(item)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all">
                        {item.userId?.image ? (
                          <Image
                            src={item.userId.image.url}
                            alt={item.userId.name}
                            height={80}
                            width={80}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            priority={false}
                          />
                        ) : (
                          <Image
                            src="/user.png"
                            alt="Default avatar"
                            height={80}
                            width={80}
                            className="w-full h-full object-cover"
                            priority={false}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 capitalize truncate mb-1 group-hover:text-gray-700 transition-colors">
                        {item.userId.name}
                      </h2>
                      <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                        Artist
                      </p>
                    </div>
                  </div>

                  <button
                    className="text-xs w-full cursor-pointer transition-all bg-black/75 text-white px-6 py-2 rounded-lg border-black border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      redirectToURI(
                        `/dashboard/admin/branches/${item.userId.branch.name}/${item.userId.name}?id=${item._id}`
                      );
                    }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBranchDetails;
