import { Attendance, attendanceStatus } from "@/types/global";
import { Calendar, Ban, Plane, User } from "lucide-react";
import Image from "next/image";
import React from "react";

type AbsentiesCardProps = {
  attendance: Attendance;
};

const AbsentiesCard: React.FC<AbsentiesCardProps> = ({ attendance }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: attendanceStatus) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-50 text-green-700 border-green-100";
      case "ABSENT":
        return "bg-red-50 text-red-700 border-red-100";
      case "LEAVE":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "HOLIDAY":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "WORKING_HOLIDAY":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "REJECTED_LEAVE":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "DISMISSED":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "PENDING":
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status: attendanceStatus) => {
    switch (status) {
      case "ABSENT":
        return <Ban className="h-4 w-4" />;
      case "LEAVE":
        return <Plane className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 p-4 sm:p-6 shadow-sm hover:shadow-md">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image
            src={attendance.userId?.image?.url || "/user.png"}
            height={48}
            width={48}
            alt={attendance.userId?.name || "User Avatar"}
            className="rounded-full border-2 border-gray-100 object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-base">
              {attendance.userId?.name || "Unknown User"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(attendance.status)}`}>
                {attendance.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Section */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{formatDate(attendance.date)}</span>
      </div>

      {/* Status and Leave Description */}
      <div className="space-y-4">
        {/* Status Card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            {getStatusIcon(attendance.status)}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-sm font-semibold text-gray-900">
              {attendance.status.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* Leave Description - Only show if type is LEAVE and description exists */}
        {attendance.type === "LEAVE" && attendance.leaveDescription && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-2">Leave Description</p>
            <p className="text-sm text-blue-800">
              {attendance.leaveDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsentiesCard;