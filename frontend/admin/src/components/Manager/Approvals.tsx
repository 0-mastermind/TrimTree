import { addAttendance, removeAttendance } from "@/store/features/attendance/attendance.slice";
import { RootState, useAppDispatch } from "@/store/store";
import { approveAttendance, dismissAttendance, fetchPendingAttendance, rejectAttendance } from "@/utils/api/attendance";
import { connectSocket, disconnectSocket, socket } from "@/utils/socket";
import { CircleX, Check, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const pendingAttendance = useSelector((state: RootState) => state.attendance.attendances);

  const dispatch = useAppDispatch();
  
  useEffect(() => { 
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchPendingAttendance());
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
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.error("Error approving attendance:", error);
    }finally {
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
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.error("Error approving attendance:", error);
    }finally {
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
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.error("Error approving attendance:", error);
    }finally {
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

    const handleAttendanceRequest = (payload: any) => {
      dispatch(addAttendance(payload.data));
      toast(payload.message);
      playSound();
    };

    const handlePunchOutRequest = (payload: any) => {
      dispatch(addAttendance(payload.data));
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
  }, [dispatch, user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-0">
      {pendingAttendance && pendingAttendance.length > 0 ? (
        pendingAttendance.map((attendance) => (
          <div 
            key={attendance._id}
            className="w-full rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            {/* Avatar */}
            <div className="flex-shrink-0 self-center sm:self-auto">
              <Image
                src={attendance.userId?.image?.url || "/user.png"}
                height={70}
                width={70}
                alt={attendance.userId?.name || "User Avatar"}
                className="rounded-full border-2 border-gray-200 object-cover w-[70px] h-[70px] sm:w-[75px] sm:h-[75px] lg:w-[80px] lg:h-[80px]"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow gap-2 min-w-0 w-full sm:w-auto">
              {/* Staff info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="min-w-0 flex-shrink">
                  <h1 className="text-lg sm:text-base lg:text-lg font-semibold text-gray-800 truncate">
                    {attendance.userId?.name || "Unknown User"}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1 sm:mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    {formatDate(attendance.date)}
                  </p>
                  <div className="flex items-center gap-2 mt-2 sm:mt-1.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                      attendance.workingHour === "FULL_DAY" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {attendance.workingHour === "FULL_DAY" ? "Full Day" : "Half Day"}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 sm:ml-2">
                  <p className="text-xs text-gray-500 mb-1">Punch In</p>
                  <p className="text-sm sm:text-xs lg:text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {formatTime(attendance.punchIn.time)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 mt-2 sm:mt-2">
                <button 
                  disabled={btnLoading}
                  onClick={() => handleApproveAttendance(attendance._id)}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg bg-green-500 text-white text-xs sm:text-xs lg:text-sm font-medium hover:bg-green-600 active:bg-green-700 transition sm:flex-1 lg:flex-initial sm:min-w-[85px] ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Check className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 hidden sm:inline" />
                  <span>Approve</span>
                </button>
                <button 
                  disabled={btnLoading}
                  onClick={() => handleRejectAttendance(attendance._id)}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg bg-red-500 text-white text-xs sm:text-xs lg:text-sm font-medium hover:bg-red-600 active:bg-red-700 transition sm:flex-1 lg:flex-initial sm:min-w-[85px] cursor-pointer  ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <X className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 hidden sm:inline" />
                  <span>Reject</span>
                </button>
                <button 
                 disabled={btnLoading}
                  onClick={() => handleDismissAttendance(attendance._id)}
                  className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs sm:text-xs lg:text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition sm:flex-1 lg:flex-initial sm:min-w-[85px] cursor-pointer  ${btnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <CircleX className="h-4 w-4 sm:h-3 sm:w-3 lg:h-4 lg:w-4 hidden sm:inline" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          No pending attendance approvals
        </div>
      )}
    </div>
  );
};

export default Approvals;