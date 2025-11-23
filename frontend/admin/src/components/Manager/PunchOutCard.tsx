import { Attendance } from "@/types/global";
import { Calendar, Check, X, LogIn, LogOut, Loader } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAppDispatch } from "@/store/store";
import { approvePunchOut, rejectPunchOut } from "@/utils/api/attendance";
import { removePunchOut } from "@/store/features/attendance/attendance.slice";

type PunchOutCardProps = {
  attendance: Attendance;
};

const PunchOutCard: React.FC<PunchOutCardProps> = ({ attendance }) => {
  const dispatch = useAppDispatch();
  const [btnLoading, setBtnLoading] = useState<string | null>(null);

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

  const handleAction = async (action: 'approve' | 'reject') => {
    try {
      setBtnLoading(action);
      let res;
      
      switch (action) {
        case 'approve':
          res = await dispatch(approvePunchOut(attendance._id));
          break;
        case 'reject':
          res = await dispatch(rejectPunchOut(attendance._id));
          break;
      }
      
      if (res) {
        dispatch(removePunchOut(attendance._id));
      }
    } finally {
      setBtnLoading(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 p-4 sm:p-6 shadow-sm hover:shadow-md relative">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
              {formatTime(attendance.punchOut.time)}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="sm:hidden flex items-center gap-2 pt-4 border-t border-gray-100">
        <button 
          disabled={btnLoading === 'approve'}
          onClick={() => handleAction('approve')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
            btnLoading === 'approve' 
              ? "bg-green-500 text-white opacity-50 cursor-not-allowed" 
              : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          }`}
        >
          {btnLoading === 'approve' ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>Approve</span>
        </button>
        <button 
          disabled={btnLoading === 'reject'}
          onClick={() => handleAction('reject')}
          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
            btnLoading === 'reject'
              ? "bg-red-500 text-white opacity-50 cursor-not-allowed" 
              : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
          }`}
        >
          {btnLoading === 'reject' ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <span>Reject</span>
        </button>
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2 pt-4 border-t border-gray-100">
        <button 
          disabled={btnLoading === 'approve'}
          onClick={() => handleAction('approve')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
            btnLoading === 'approve' 
              ? "bg-green-500 text-white opacity-50 cursor-not-allowed" 
              : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          }`}
        >
          {btnLoading === 'approve' ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>Approve</span>
        </button>
        <button 
          disabled={btnLoading === 'reject'}
          onClick={() => handleAction('reject')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
            btnLoading === 'reject'
              ? "bg-red-500 text-white opacity-50 cursor-not-allowed" 
              : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
          }`}
        >
          {btnLoading === 'reject' ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};

export default PunchOutCard;