import { removeLeaves } from "@/store/features/attendance/attendance.slice";
import { useAppDispatch } from "@/store/store";
import { approveLeave, rejectLeave } from "@/utils/api/attendance";
import { Check, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ApprovalCardProps {
  leaveId?: string;
  staffName: string;
  avatarUrl: string;
  fromDate: string;        
  toDate: string;         
  description: string;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({
  leaveId,
  staffName,
  avatarUrl,
  fromDate,
  toDate,
  description,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleRejectLeave =  async ()  => {
    try {
      setLoading(true);
      const res = await dispatch(rejectLeave(leaveId!));
      if (res && leaveId) {
        dispatch(removeLeaves(leaveId));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error rejecting leave:", error);
    } finally {
      setLoading(false);
    }
  }

   const handleApproveLeave =  async ()  => {
    try {
      setLoading(true);
      const res = await dispatch(approveLeave(leaveId!));
      if (res && leaveId) {
        dispatch(removeLeaves(leaveId));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error rejecting leave:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
        {/* Card Header */}
        <div className="flex items-start p-5 border-b border-gray-100">
          <div className="relative flex-shrink-0 mr-4">
            <Image
              src={avatarUrl}
              width={60}
              height={60}
              alt={`${staffName} Avatar`}
              className="rounded-full border-2 border-gray-100"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {staffName}
            </h2>
          </div>
        </div>

        {/* Date Information */}
        <div className="p-5 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                From Date
              </p>
              <p className="text-sm font-medium text-gray-800">{fromDate}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                To Date
              </p>
              <p className="text-sm font-medium text-gray-800">{toDate}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Description
          </p>
          <p className="text-sm text-gray-700">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex justify-end space-x-3">
          <button className={`flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 cursor-pointer ${loading ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={handleRejectLeave}>
            <X className="h-4 w-4 mr-1" />
            Reject
          </button>
          <button className={`flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""} cursor-pointer`}
          onClick={handleApproveLeave}
          disabled={loading}>
            <Check className="h-4 w-4 mr-1" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
