"use client";
import Loader from "@/components/common/Loader";
import ApprovalCard from "@/components/Manager/ApprovalCard";
import { addLeaves } from "@/store/features/attendance/attendance.slice";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchPendingLeaves } from "@/utils/api/attendance";
import { connectSocket, disconnectSocket, socket } from "@/utils/socket";
import { CircleCheck } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();

  const pendingLeaves = useSelector(
    (state: RootState) => state.attendance.leaves
  );

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchPendingLeaves());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

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

    const handleLeaveRequest = (payload: any) => {
      dispatch(addLeaves(payload.data));
      toast(payload.message);
      playSound();
    };


    socket.on("leaveRequest", handleLeaveRequest);

    return () => {
      disconnectSocket();
      socket.off("leaveRequest", handleLeaveRequest);
    };
  }, [dispatch, user?._id]);

  if (loading || !pendingLeaves) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <button
          className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
          onClick={() => redirect("/dashboard/manager/set-holiday")}
        >
          <CircleCheck className="h-4 w-4 md:h-5 md:w-5" /> Set Holiday
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 pt-6 gap-8">
        {pendingLeaves.map((leave) => (
          <ApprovalCard
            key={leave._id}
            leaveId={leave._id}
            staffName={leave.userId?.name || "Unknown"}
            avatarUrl={leave.userId?.image?.url || "/user.png"}
            fromDate={new Date(leave.startDate).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            toDate={new Date(leave.endDate).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              month: "short",
              day: "numeric", 
              year: "numeric",
            })}
            description={leave.reason || "No reason provided"}
          />
        ))}
      </div>

      {pendingLeaves.length === 0 && <div className="h-screen w-full flex justify-center mt-50">
        <p>No Leaves Requests to show</p></div>}
    </div>
  );
};

export default Page;
