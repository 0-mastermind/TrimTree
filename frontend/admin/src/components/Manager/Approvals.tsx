import { CircleX } from "lucide-react";
import Image from "next/image";
import React from "react";

const Approvals = () => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 md:gap-6">
      <div className="w-full rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src="/user.png"
            height={80}
            width={80}
            alt="User Avatar"
            className="rounded-full border border-gray-200"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow gap-2">
          {/* Staff info */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Staff Name
              </h1>
              <p className="text-sm text-gray-600">Hairstylist</p>
            </div>
            <p className="text-sm text-gray-500">Punch In</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition">
              Approve
            </button>
            <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition">
              <CircleX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src="/user.png"
            height={80}
            width={80}
            alt="User Avatar"
            className="rounded-full border border-gray-200"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow gap-2">
          {/* Staff info */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Staff Name
              </h1>
              <p className="text-sm text-gray-600">Hairstylist</p>
            </div>
            <p className="text-sm text-gray-500">Punch In</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition">
              Approve
            </button>
            <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition">
              <CircleX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src="/user.png"
            height={80}
            width={80}
            alt="User Avatar"
            className="rounded-full border border-gray-200"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow gap-2">
          {/* Staff info */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Staff Name
              </h1>
              <p className="text-sm text-gray-600">Hairstylist</p>
            </div>
            <p className="text-sm text-gray-500">Punch In</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition">
              Approve
            </button>
            <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition">
              <CircleX className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approvals;
