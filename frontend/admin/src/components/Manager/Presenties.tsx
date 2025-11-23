import { Attendance } from "@/types/global";
import { Calendar, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import React from "react";

type PresentiesCardProps = {
  attendance: Attendance;
};

const PresentiesCard: React.FC<PresentiesCardProps> = ({ attendance }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                attendance.workingHour === "FULL_DAY" 
                  ? "bg-blue-50 text-blue-700 border border-blue-100" 
                  : "bg-orange-50 text-orange-700 border border-orange-100"
              }`}>
                {attendance.workingHour === "FULL_DAY" ? "Full Day" : "Half Day"}
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

      {/* Time Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Punch In */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
            <LogIn className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Punch In</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatTime(attendance.punchIn.time)}
            </p>
          </div>
        </div>

        {/* Punch Out */}
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Punch Out</p>
            <p className="text-sm font-semibold text-red-700">
              {attendance.punchOut.time ? formatTime(attendance.punchOut.time) : "Not Applied"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentiesCard;