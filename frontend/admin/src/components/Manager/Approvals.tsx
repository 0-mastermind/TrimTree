import { addAttendance, addPunchOut, removeAttendance, removePunchOut } from "@/store/features/attendance/attendance.slice";
import { RootState, useAppDispatch } from "@/store/store";
import { approveAttendance, approvePunchOut, dismissAttendance, fetchPendingAttendance, fetchPendingPunchOuts, rejectAttendance, rejectPunchOut } from "@/utils/api/attendance";
import { connectSocket, disconnectSocket, socket } from "@/utils/socket";
import { CircleX, Check, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import { ApiResponse, Attendance, pendingAttendance } from "@/types/global";

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'punchin' | 'punchout'>('punchin');
  
  const user = useSelector((state: RootState) => state.auth.user);
  const pendingAttendance = useSelector((state: RootState) => state.attendance.attendances);
  const pendingPunchOuts = useSelector((state: RootState) => state.attendance.punchOuts);  
  const dispatch = useAppDispatch();
   
  useEffect(() => { 
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchPendingAttendance());
        await dispatch(fetchPendingPunchOuts());
      } catch (error) {
        console.error("Error fetching pending attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleApproveAttendance = async (id: string) => {
    try {
      setBtnLoading(true);
      const res = await dispatch(approveAttendance(id));
      if (res) {
        dispatch(removeAttendance(id));
      }
    } catch (error) {
      console.error("Error approving attendance:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleRejectAttendance = async (id: string) => {
    try {
      setBtnLoading(true);
      const res = await dispatch(rejectAttendance(id));
      if (res) {
        dispatch(removeAttendance(id));
      }
    } catch (error) {
      console.error("Error rejecting attendance:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDismissAttendance = async (id: string) => {
    try {
      setBtnLoading(true);
      const res = await dispatch(dismissAttendance(id));
      if (res) {
        dispatch(removeAttendance(id));
      }
    } catch (error) {
      console.error("Error dismissing attendance:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleApprovePunchOut = async (id: string) => {
    try {
      setBtnLoading(true);
      const res = await dispatch(approvePunchOut(id));
      if (res) {
        dispatch(removePunchOut(id));
      }
    } catch (error) {
      console.error("Error approving punch-out:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleRejectPunchOut = async (id: string) => {
    try {
      setBtnLoading(true);
      const res = await dispatch(rejectPunchOut(id));
      if (res) {
        dispatch(removePunchOut(id));
      }
    } catch (error) {
      console.error("Error rejecting punch-out:", error);
    } finally {
      setBtnLoading(false);
    }
  };

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

  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      notifyAudioRef.current = new Audio("/notification.mp3");
    }
  }, []);

  useEffect(() => {
    connectSocket();

    if (user?.branch && user?._id) {
      socket.emit(
        "joinRoom",
        `manager:${user._id}`
      );
    }

    const playSound = () => {
      try {
        notifyAudioRef.current?.play();
      } catch (e) {
        console.error("Error playing notification sound:", e);
      }
    };

    const handleAttendanceRequest = (payload: ApiResponse) => {
      dispatch(addAttendance(payload.data as pendingAttendance));
      toast(payload.message);
      playSound();
    };

    const handlePunchOutRequest = (payload: ApiResponse) => {
      dispatch(addPunchOut(payload.data as pendingAttendance));
      toast(payload.message);
      playSound();
    };

    socket.on("attendanceRequest", handleAttendanceRequest);
    socket.on("punchOutRequest", handlePunchOutRequest);

    return () => {
      disconnectSocket();
      socket.off("attendanceRequest", handleAttendanceRequest);
      socket.off("punchOutRequest", handlePunchOutRequest);
    };
  }, [dispatch, user?._id, user?.branch]);

  const renderPunchInCard = (attendance: Attendance) => (
    <div 
      key={attendance._id}
      className="w-full rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 self-center sm:self-auto">
        <Image
          src={attendance.userId?.image?.url || "/user.png"}
          height={70}
          width={70}
          alt={attendance.userId?.name || "User Avatar"}
          className="rounded-full border-2 border-gray-200 object-cover w-16 h-16 sm:w-[70px] sm:h-[70px] lg:w-20 lg:h-20"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow gap-3 min-w-0 w-full sm:w-auto">
        {/* Staff info */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-grow">
            <h1 className="text-lg sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
              {attendance.userId?.name || "Unknown User"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-2 bg-gray-100 px-3 py-1.5 rounded-md inline-block">
              {formatDate(attendance.date)}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                attendance.workingHour === "FULL_DAY" 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-orange-100 text-orange-700"
              }`}>
                {attendance.workingHour === "FULL_DAY" ? "Full Day" : "Half Day"}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="text-xs text-gray-500 mb-1">Punch In</p>
            <p className="text-base sm:text-sm lg:text-base font-semibold text-gray-700 whitespace-nowrap">
              {formatTime(attendance.punchIn.time)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <button 
            disabled={btnLoading}
            onClick={() => handleApproveAttendance(attendance._id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 active:bg-green-700 transition-colors duration-200 flex-1 sm:flex-initial sm:min-w-[100px] ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Check className="h-4 w-4" />
            <span>Approve</span>
          </button>
          <button 
            disabled={btnLoading}
            onClick={() => handleRejectAttendance(attendance._id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:bg-red-700 transition-colors duration-200 flex-1 sm:flex-initial sm:min-w-[100px] ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <X className="h-4 w-4" />
            <span>Reject</span>
          </button>
          <button 
            disabled={btnLoading}
            onClick={() => handleDismissAttendance(attendance._id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 flex-1 sm:flex-initial sm:min-w-[100px] ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <CircleX className="h-4 w-4" />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPunchOutCard = (punchOut: Attendance) => (
    <div 
      key={punchOut._id}
      className="w-full rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 self-center sm:self-auto">
        <Image
          src={punchOut.userId?.image?.url || "/user.png"}
          height={70}
          width={70}
          alt={punchOut.userId?.name || "User Avatar"}
          className="rounded-full border-2 border-gray-200 object-cover w-16 h-16 sm:w-[70px] sm:h-[70px] lg:w-20 lg:h-20"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow gap-3 min-w-0 w-full sm:w-auto">
        {/* Staff info */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="min-w-0 flex-grow">
            <h1 className="text-lg sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
              {punchOut.userId?.name || "Unknown User"}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-2 bg-gray-100 px-3 py-1.5 rounded-md inline-block">
              {formatDate(punchOut.date)}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                punchOut.workingHour === "FULL_DAY" 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-orange-100 text-orange-700"
              }`}>
                {punchOut.workingHour === "FULL_DAY" ? "Full Day" : "Half Day"}
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Punch In</p>
              <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                {formatTime(punchOut.punchIn.time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Punch Out</p>
              <p className="text-base sm:text-sm lg:text-base font-semibold text-red-600 whitespace-nowrap">
                {formatTime(punchOut.punchOut.time)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <button 
            disabled={btnLoading}
            onClick={() => handleApprovePunchOut(punchOut._id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 active:bg-green-700 transition-colors duration-200 flex-1 sm:flex-initial sm:min-w-[100px] ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Check className="h-4 w-4" />
            <span>Approve</span>
          </button>
          <button 
            disabled={btnLoading}
            onClick={() => handleRejectPunchOut(punchOut._id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 active:bg-red-700 transition-colors duration-200 flex-1 sm:flex-initial sm:min-w-[100px] ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <X className="h-4 w-4" />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Loader />
    );
  }

  const currentData = activeTab === 'punchin' ? pendingAttendance : pendingPunchOuts;
  const emptyMessage = activeTab === 'punchin' 
    ? "No pending punch-in approvals" 
    : "No pending punch-out approvals";

  return (
    <div className="px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-6 sm:mb-8 flex justify-center">
        <div className="flex w-full max-w-sm sm:max-w-md mt-10 bg-gray-50 inset border-box-shadow rounded-xl p-1">
          <button
            onClick={() => setActiveTab('punchin')}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'punchin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Punch In ({pendingAttendance?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('punchout')}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'punchout'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Punch Out ({pendingPunchOuts?.length || 0})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {currentData && currentData.length > 0 ? (
          currentData.map((item) => 
            activeTab === 'punchin' 
              ? renderPunchInCard(item as Attendance)
              : renderPunchOutCard(item as Attendance)
          )
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;