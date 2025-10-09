"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CircleCheck, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getEmployeesByManager } from "@/utils/api/staff";
import { addOfficialHoliday } from "@/utils/api/manager";
import Image from "next/image";

const HolidayForm = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  // const [isPaidHoliday, setIsPaidHoliday] = useState(false);

  const fetchEmployeesData = useCallback(async () => {
    try {
      await dispatch(getEmployeesByManager());
    } catch (error) {
      console.log("Error! while fetching employees data", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((member) => {
    const nameMatch = member.userId.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const designationMatch = member.designation
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch || designationMatch;
  });

  // Handle individual checkbox selection
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allFilteredIds = filteredEmployees.map(
        (member) => member.userId._id
      );
      setSelectedEmployeeIds(allFilteredIds);
    } else {
      setSelectedEmployeeIds([]);
    }
  };

  // Check if all filtered employees are selected
  const isAllSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((member) =>
      selectedEmployeeIds.includes(member.userId._id)
    );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const holidayData = {
        name: title,
        date: holidayDate,
        employees: selectedEmployeeIds,
      };
      
      const res = await dispatch(addOfficialHoliday(holidayData));

      // Redirect after successful submission
      if (res) {
        setSelectedEmployeeIds([]);
        setTitle("");
        setHolidayDate("")
        router.push("/dashboard/manager/view-calendar");
      }
    } catch (error) {
      console.error("Error setting holiday:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="card bg-base-100 shadow-md rounded-box p-6">
        <form onSubmit={handleSubmit}>
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span className="label-text font-semibold">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered focus:outline-none w-full"
                placeholder="Title of the holiday (short)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Date of Holiday
                </span>
              </label>
               <input
                type="date"
                className="input input-bordered focus:outline-none w-full"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Paid Holiday Option */}
          {/* <div className="mb-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={isPaidHoliday}
                onChange={(e) => setIsPaidHoliday(e.target.checked)}
              />
              <span className="label-text font-semibold">Paid Holiday</span>
            </label>
          </div> */}

          {/* Staff Selection */}
          <div className="border-base-300 rounded-box border p-4">
            <h5 className="text-lg font-semibold mb-4">Included Staff</h5>

            {/* Search and Select All */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 -left-1 top-1 pl-3 flex items-center pointer-events-none z-10 h-8 w-8">
                    <Search />
                  </div>
                  <input
                    type="search"
                    placeholder="Search staff members..."
                    className="input input-bordered pl-10 w-full focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                  <span className="label-text font-semibold">Select All</span>
                </label>
              </div>
            </div>

            {/* Staff member list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((member) => (
                  <div
                    key={member._id}
                    className="card card-side bg-base-100 shadow-sm border border-base-300 p-3 flex items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedEmployeeIds.includes(
                          member.userId._id
                        )}
                        onChange={() =>
                          handleEmployeeSelection(member.userId._id)
                        }
                      />

                      <div className="avatar">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                          {member.userId.image ? (
                            <Image
                              src={member.userId.image.url}
                              alt={member.userId.name}
                              layout="fill"
                            />
                          ) : (
                            <Image src={"/user.png"} fill alt={member.userId.name} objectFit="cover" sizes="48px" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-base-content truncate">
                          {member.userId.name}
                        </h4>
                        <p className="text-xs text-base-content/70 truncate">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-base-content/70">
                  No staff members found
                </div>
              )}
            </div>

            {/* Selected count */}
            <div className="mt-4 text-sm text-base-content/70">
              {selectedEmployeeIds.length} staff member
              {selectedEmployeeIds.length !== 1 ? "s" : ""} selected
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || selectedEmployeeIds.length === 0}
              className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:translate-y-0 disabled:hover:border-b-[4px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  Setting Holiday...
                </>
              ) : (
                <>
                  <CircleCheck className="h-4 w-4 md:h-5 md:w-5" />
                  Set Holiday
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayForm;