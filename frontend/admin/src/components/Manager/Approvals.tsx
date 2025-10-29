import { addAttendance, addPunchOut } from "@/store/features/attendance/attendance.slice";
import { RootState, useAppDispatch } from "@/store/store";
import {
  fetchAbsenties,
  fetchNotapplied,
  fetchPendingAttendance,
  fetchPendingPunchOuts,
  fetchPresenties,
} from "@/utils/api/attendance";
import { connectSocket, disconnectSocket, socket } from "@/utils/socket";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import { ApiResponse, Attendance, pendingAttendance, User } from "@/types/global";
import PunchInCard from "./PunchInCard";
import PunchOutCard from "./PunchOutCard";
import NotAppliedCard from "./NotAppliedCard";
import PresentiesCard from "./Presenties";
import AbsentiesCard from "./Absenties";

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"punchin" | "punchout" | "attendance">("punchin");
  const [attendanceSubTab, setAttendanceSubTab] = useState<
    "presenties" | "absenties" | "notapplied"
  >("presenties");

  const user = useSelector((state: RootState) => state.auth.user);
  const pendingAttendance = useSelector((state: RootState) => state.attendance.attendances);
  const pendingPunchOuts = useSelector((state: RootState) => state.attendance.punchOuts);
  const presentiesData = useSelector((state: RootState) => state.attendance.presenties) || [];
  const absentiesData = useSelector((state: RootState) => state.attendance.absenties) || [];
  const notAppliedData = useSelector((state: RootState) => state.attendance.notapplied) || [];

  const dispatch = useAppDispatch();

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchPendingAttendance());
        await dispatch(fetchPendingPunchOuts());
        await dispatch(fetchAbsenties());
        await dispatch(fetchPresenties());
        await dispatch(fetchNotapplied());
      } catch (error) {
        console.error("Error fetching pending attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // ✅ Notification sound
  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      notifyAudioRef.current = new Audio("/notification.mp3");
    }
  }, []);

  // ✅ Socket setup
  useEffect(() => {
    connectSocket();

    if (user?.branch && user?._id) {
      socket.emit("joinRoom", `manager:${user._id}`);
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

  // ✅ Handle sub-tab data (typed union)
  let attendanceSubTabData: (Attendance | User)[] = [];
  if (attendanceSubTab === "presenties") attendanceSubTabData = presentiesData;
  else if (attendanceSubTab === "absenties") attendanceSubTabData = absentiesData;
  else if (attendanceSubTab === "notapplied") attendanceSubTabData = notAppliedData;

  if (loading) {
    return <Loader />;
  }

  const currentData = activeTab === "punchin" ? pendingAttendance : pendingPunchOuts;
  const emptyMessage =
    activeTab === "punchin"
      ? "No pending punch-in approvals"
      : activeTab === "punchout"
      ? "No pending punch-out approvals"
      : "";

  return (
    <div className="px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-6 sm:mb-8 flex justify-center">
        <div className="flex w-full max-w-sm sm:max-w-md mt-10 bg-gray-50 border-box-shadow rounded-xl p-1">
          <button
            onClick={() => setActiveTab("punchin")}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
              activeTab === "punchin"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Punch In ({pendingAttendance?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("punchout")}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
              activeTab === "punchout"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Punch Out ({pendingPunchOuts?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 ${
              activeTab === "attendance"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Attendance
          </button>
        </div>
      </div>

      {/* Attendance Sub Tabs */}
      {activeTab === "attendance" && (
        <div className="mb-6 flex justify-center">
          <div className="flex w-full max-w-xs bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAttendanceSubTab("presenties")}
              className={`flex-1 px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                attendanceSubTab === "presenties"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Presenties
            </button>
            <button
              onClick={() => setAttendanceSubTab("absenties")}
              className={`flex-1 px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                attendanceSubTab === "absenties"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Absenties
            </button>
            <button
              onClick={() => setAttendanceSubTab("notapplied")}
              className={`flex-1 px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                attendanceSubTab === "notapplied"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Not Applied
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "attendance" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {attendanceSubTabData && attendanceSubTabData.length > 0 ? (
            attendanceSubTabData.map((item) => {
              if (attendanceSubTab === "presenties") {
                return <PresentiesCard attendance={item as Attendance} key={item._id} />;
              }
              if (attendanceSubTab === "absenties") {
                return <AbsentiesCard attendance={item as Attendance} key={item._id} />;
              }
              return <NotAppliedCard user={item as User} key={item._id} />;
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {attendanceSubTab === "presenties"
                ? "No presenties."
                : attendanceSubTab === "absenties"
                ? "No absenties."
                : "No not applied records."}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {currentData && currentData.length > 0 ? (
            currentData.map((item) =>
              activeTab === "punchin" ? (
                <PunchInCard attendance={item as Attendance} key={item._id} />
              ) : (
                <PunchOutCard attendance={item as Attendance} key={item._id} />
              )
            )
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Approvals;
