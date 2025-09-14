"use client";
import { attendanceData, metricsData } from "@/data/data";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import "@/app/calendar.css";
import dynamic from "next/dynamic";
import { useState } from "react";
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

const User = () => {
  const [deleteUserSection, setDeleteUserSection] = useState(false);

  const handleEmployeeDelete = () => {
    console.log("Employee is deleted");
  }
  
  return (
    <div className="mt-6 p-2">
      {/* User Details */}
      <div className="flex gap-4">
        <div>
          <Image
            src={"/user.png"}
            alt="Store illustration"
            height={70}
            width={70}
            className="rounded-lg"
            priority={true}
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Employee Name</h1>
          <p className="text-black/60 mt-1">Artist</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Metrics */}
          {metricsData.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-1 p-4 items-center justify-center flex-col shadow-md rounded-md">
                <h1 className="text-4xl text-bold">{item.value}</h1>
                <p className="text-sm text-black mt-2">{item.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Paycheck details */}
          <div className="shadow-md rounded-xl p-4 sm:p-6 w-full mx-auto bg-white">
            <h4 className="mb-4 font-semibold text-lg border-b border-black/20 pb-2">
              Paycheck Details (from_date to current_date)
            </h4>

            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base flex justify-between">
                <span className="font-semibold">Gross Salary:</span>
                <span className="text-right">25,000</span>
              </p>

              <p className="text-sm sm:text-base flex justify-between">
                <span className="font-semibold">Deduction:</span>
                <span className="text-right">2,500 x 2</span>
              </p>

              <p className="text-sm sm:text-base flex justify-between">
                <span className="font-bold">Net Salary:</span>
                <span className="text-right font-bold text-green-500">
                  20,000
                </span>
              </p>
            </div>

            <button className="text-xs sm:text-sm mt-6 cursor-pointer transition-all bg-yellow-400 text-white px-6 py-3 rounded-lg border-yellow-500 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center justify-center w-full font-bold">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> Mark as paid
            </button>
          </div>

          {/* User Attendance */}
          <div>
            <Calendar
              tileContent={({ date }) => {
                const formattedDate = date.toLocaleDateString("en-GB");

                const record = attendanceData.find(
                  (a) => a.date === formattedDate
                );

                if (record?.status === "present") {
                  return <span className="text-green-500 text-xs ml-1">⬤</span>;
                }

                if (record?.status === "absent") {
                  return <span className="text-red-500 text-xs ml-1">⬤</span>;
                }

                if (record?.status === "non-paid-holiday") {
                  return (
                    <span className="text-yellow-500 text-xs ml-1">⬤</span>
                  );
                }

                if (record?.status === "halfday") {
                  return <span className="text-blue-500 text-xs ml-1">⬤</span>;
                }

                if (record?.status === "paid-holiday") {
                  return (
                    <span className="text-purple-500 text-xs ml-1">⬤</span>
                  );
                }

                return null;
              }}
            />

            <div className="flex gap-3 mt-1 text-gray-700 justify-end text-xs">
              <div className="flex items-center">
                <span className="text-green-500 text-xs mx-1">⬤</span>{" "}
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 text-xs mx-1">⬤</span>{" "}
                <span>Absent</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xs mx-1">⬤</span>{" "}
                <span>Half Day</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 text-xs mx-1">⬤</span>{" "}
                <span>Non-Paid Holiday</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-500 text-xs mx-1">⬤</span>{" "}
                <span>Paid Holiday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete user section */}
        <div className="my-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Danger Zone</h3>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">
                Click to enable this section
              </span>
              <input
                onChange={() => setDeleteUserSection(!deleteUserSection)}
                type="checkbox"
                className="h-4 w-4"
              />
            </div>
          </div>
          <button
            className="w-full bg-red-500 p-2 text-sm mt-4 rounded-md text-white cursor-pointer disabled:bg-red-500/50 disabled:cursor-default"
            disabled={!deleteUserSection}
            title="This action will delete this employee permanantly"
            onClick={() => handleEmployeeDelete()}
            >
            Remove employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
