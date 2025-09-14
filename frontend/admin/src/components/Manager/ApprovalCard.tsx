import { Check, X } from "lucide-react";
import Image from "next/image";

const ApprovalCard = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
        {/* Card Header */}
        <div className="flex items-start p-5 border-b border-gray-100">
          <div className="relative flex-shrink-0 mr-4">
            <Image
              src="/user.png"
              width={60}
              height={60}
              alt="Staff Avatar"
              className="rounded-full border-2 border-gray-100"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">Staff Name</h2>
            <p className="text-sm text-gray-600">Hairstylist</p>
          </div>
        </div>

        {/* Date Information */}
        <div className="p-5 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                From Date
              </p>
              <p className="text-sm font-medium text-gray-800">Aug 21, 2023</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                To Date
              </p>
              <p className="text-sm font-medium text-gray-800">Aug 25, 2023</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Description
          </p>
          <p className="text-sm text-gray-700">
            Family vacation out of state. Need time off to spend with relatives
            visiting from abroad.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex justify-end space-x-3">
          <button className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200">
            <X className="h-4 w-4 mr-1" />
            Reject
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
            <Check className="h-4 w-4 mr-1" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
