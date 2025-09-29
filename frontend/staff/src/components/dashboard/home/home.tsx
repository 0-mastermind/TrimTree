import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  Calendar,
  Plus,
  LogIn,
  LogOut,
  Timer,
  Plane,
  User,
  Clock,
} from "lucide-react";
import type {
  Attendance,
  attendanceType,
  WorkingHour,
} from "@/types/type";
import { getPunchOutStatusConfig, getStatusConfig } from "./colorConfigs";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import { useAppDispatch } from "@/store/hook";
import {
  applyForAttendance,
  applyForLeave,
  applyForPunchOut,
  getTodayAttendance,
} from "@/api/attendance";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { connectSocket, disconnectSocket, socket } from "@/lib/socket";
import { setTodayAttendance } from "@/store/features/attendance.slice";
import toast from "react-hot-toast";

// ================= Props =================
interface AttendanceStatusProps {
  attendance?: Attendance | null;
  actionLoading: boolean;
  onApplyAttendance?: (workingHour: WorkingHour) => Promise<void>;
  onApplyLeave?: (reason: string, date: string) => Promise<void>; // ONE DAY LEAVE
  onApplyPunchOut?: () => Promise<void>;
}

// Helper
const formatSingleDate = (d: Date) => {
  return new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  ).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

// ================= Component: AttendanceStatus =================
const AttendanceStatus: React.FC<AttendanceStatusProps> = ({
  attendance,
  actionLoading,
  onApplyAttendance,
  onApplyLeave,
  onApplyPunchOut,
}) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isPunchOutModalOpen, setIsPunchOutModalOpen] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] =
    useState<attendanceType>("ATTENDANCE");

  // One-day leave
  const [leaveDescription, setLeaveDescription] = useState("");

  const isAttendanceType = attendance?.type === "ATTENDANCE";
  const isLeaveType = attendance?.type === "LEAVE";
  const isHoliday = attendance?.status === "HOLIDAY";

  const formatTime = (date?: Date | string | null) => {
    if (!date) return "--:--";
    try {
      return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "--:--";
    }
  };

  const formatDateVerbose = (date?: Date | string | null) => {
    if (!date) return "--";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "--";
    }
  };

  const handleApplicationClick = () => {
    // Force ATTENDANCE when holiday
    setSelectedApplicationType("ATTENDANCE");
    setIsApplicationModalOpen(true);
  };

  const handlePunchOutApplyClick = () => {
    setIsPunchOutModalOpen(true);
  };

  const handleAttendanceConfirm = async (workingHour: WorkingHour) => {
    if (!onApplyAttendance) return;
    await onApplyAttendance(workingHour);
    setIsApplicationModalOpen(false);
  };

  const handleLeaveConfirm = async () => {
    if (!onApplyLeave) return;
    if (!leaveDescription.trim()) return;
    const today = formatSingleDate(new Date());
    await onApplyLeave(leaveDescription.trim(), today);
    setIsApplicationModalOpen(false);
    setLeaveDescription("");
  };

  const handlePunchOutConfirm = async () => {
    if (!onApplyPunchOut) return;
    await onApplyPunchOut();
    setIsPunchOutModalOpen(false);
  };

  const handleCancel = () => {
    setIsApplicationModalOpen(false);
    setIsPunchOutModalOpen(false);
    setLeaveDescription("");
  };

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  // Show application button if none yet, or rejected leave, dismissed OR holiday
  // (Holiday: only allow attendance, not leave)
  const showApplicationButton =
    !attendance ||
    attendance.status === "REJECTED LEAVE" ||
    attendance.status === "DISMISSED" ||
    isHoliday;

  const showPunchTimes =
    isAttendanceType &&
    (attendance?.status === "PRESENT" ||
      attendance?.status === "WORKING HOLIDAY");

  const showPunchOutButton =
    showPunchTimes &&
    (attendance?.punchOut.status === "NOT APPLIED" ||
      attendance?.punchOut.status === "REJECTED");

  const showReason =
    (isLeaveType || isHoliday) && !!attendance?.leaveDescription;

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Today's Status
        </h2>
        <p className="text-sm text-gray-600">{todayLabel}</p>
      </div>

      {/* Application Type Badge */}
      {attendance && (
        <div className="mb-4 flex justify-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isLeaveType
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isLeaveType ? (
              <Plane className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
            {attendance.type}
            {attendance.workingHour && !isLeaveType && ` - ${attendance.workingHour}`}
          </div>
        </div>
      )}

      {/* Status Display */}
      {attendance ? (
        (() => {
          const statusConfig = getStatusConfig(attendance.status);
          const StatusIcon = statusConfig.icon;
          return (
            <div
              className={`${statusConfig.bgColor} rounded-lg p-4 mb-4 flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-md`}
            >
              <StatusIcon className={`h-8 w-8 ${statusConfig.iconColor}`} />
              <span className={`text-lg font-semibold ${statusConfig.textColor}`}>
                {statusConfig.label}
              </span>
            </div>
          );
        })()
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 mb-4 flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-md border border-red-400">
          <Clock className="h-8 w-8 text-red-500" />
          <span className="text-lg font-semibold text-red-500">
            Not Applied Yet
          </span>
        </div>
      )}

      {/* Reason (Leave or Holiday) */}
      {attendance && showReason && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            {/* Keep Plane icon for both or change icon if holiday desired */}
            <Plane className="h-4 w-4" />
            <span className="font-medium text-sm">
              {isHoliday ? "Holiday Reason" : "Leave Reason"}
            </span>
          </div>
          <p className="text-purple-800 text-sm ml-6">
            {attendance.leaveDescription}
          </p>
        </div>
      )}

      {/* Punch In */}
      {attendance && showPunchTimes && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700">
              <LogIn className="h-5 w-5" />
              <span className="font-medium">Punch In</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-800 font-semibold">
                {formatTime(attendance.punchIn?.time)}
              </span>
              {attendance.punchIn?.isApproved ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Timer className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Punch Out */}
      {attendance && showPunchTimes && (() => {
        const punchOutConfig = getPunchOutStatusConfig(
          attendance.punchOut.status
        );
        const PunchOutIcon = punchOutConfig.icon;
        return (
          <div
            className={`${punchOutConfig.bgColor} ${punchOutConfig.borderColor} border rounded-lg p-3 mb-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PunchOutIcon
                  className={`h-5 w-5 ${punchOutConfig.iconColor}`}
                />
                <span
                  className={`font-medium ${punchOutConfig.textColor}`}
                >
                  Punch Out: {punchOutConfig.label}
                </span>
              </div>
              {attendance.punchOut.status === "APPROVED" && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${punchOutConfig.textColor}`}
                  >
                    {formatTime(attendance.punchOut.time)}
                  </span>
                  {attendance.punchOut.isApproved && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Meta */}
      {attendance && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Applied:</span>{" "}
              {formatDateVerbose(attendance.createdAt)} at{" "}
              {formatTime(attendance.createdAt)}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {showApplicationButton && (
          <Button onClick={handleApplicationClick} className="w-full">
            <Plus className="h-5 w-5 mr-2" />
            Apply For Today
          </Button>
        )}

        {showPunchOutButton && (
          <Button
            onClick={handlePunchOutApplyClick}
            className="w-full"
            variant="primary"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Apply for Punch Out
          </Button>
        )}
      </div>

      {/* Application Modal */}
      {isApplicationModalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isHoliday ? "Mark Attendance For Working Holiday" : "Apply for Today"}
              </h3>
              <p className="text-sm text-gray-600">
                {isHoliday
                  ? "Applying today will mark it as Working Holiday"
                  : "Choose application type and fill the details"}
              </p>
            </div>

            {/* Tabs (Hide Leave tab if holiday) */}
            {!isHoliday && (
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setSelectedApplicationType("ATTENDANCE")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedApplicationType === "ATTENDANCE"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={actionLoading}
                >
                  <User className="h-4 w-4 mx-auto mb-1" />
                  Attendance
                </button>
                <button
                  onClick={() => setSelectedApplicationType("LEAVE")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedApplicationType === "LEAVE"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={actionLoading}
                >
                  <Plane className="h-4 w-4 mx-auto mb-1" />
                  Leave
                </button>
              </div>
            )}

            {/* Attendance Options */}
            {selectedApplicationType === "ATTENDANCE" && (
              <div className="space-y-3 mb-6">
                <Button
                  variant="success"
                  onClick={() => handleAttendanceConfirm("FULL_DAY")}
                  className="w-full"
                  disabled={actionLoading}
                >
                  Full Day Attendance
                </Button>
                <Button
                  onClick={() => handleAttendanceConfirm("HALF_DAY")}
                  variant="secondary"
                  className="w-full"
                  disabled={actionLoading}
                >
                  Half Day Attendance
                </Button>
              </div>
            )}

            {/* Leave (not shown on holiday) */}
            {!isHoliday && selectedApplicationType === "LEAVE" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={leaveDescription}
                    onChange={(e) => setLeaveDescription(e.target.value)}
                    placeholder="Enter leave reason..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                    disabled={actionLoading}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Date used: {formatSingleDate(new Date())}
                </div>
                <Button
                  onClick={handleLeaveConfirm}
                  disabled={actionLoading || !leaveDescription.trim()}
                  variant="success"
                  className="w-full"
                >
                  Submit Leave Request
                </Button>
              </div>
            )}

            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full"
              disabled={actionLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Punch Out Modal */}
      {isPunchOutModalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <LogOut className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apply for Punch Out
              </h3>
              <p className="text-sm text-gray-600">
                Request approval to punch out for today
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <Button
                onClick={handlePunchOutConfirm}
                className="w-full"
                variant="success"
                disabled={actionLoading}
              >
                Submit Punch Out Request
              </Button>
            </div>
            <Button
              onClick={handleCancel}
              className="w-full"
              variant="outline"
              disabled={actionLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= Page Component: Home =================
const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const attendance = useSelector(
    (state: RootState) => state.attendance.todayAttendance
  );

  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      notifyAudioRef.current = new Audio("/notification.mp3");
    }
  }, []);

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      setLoading(true);
      await dispatch(getTodayAttendance());
      setLoading(false);
    };
    fetchTodayAttendance();
  }, [dispatch]);

  useEffect(() => {
    connectSocket();

    if (attendance?.branch && attendance?.userId) {
      socket.emit(
        "joinRoom",
        `branch:${attendance.branch}:staffs:${attendance.userId}`
      );
    }

    const playSound = () => {
      try {
        notifyAudioRef.current?.play();
      } catch (e) {
        console.error("Error playing notification sound:", e);
      }
    };

    const handleAttendanceUpdated = (payload: any) => {
      dispatch(setTodayAttendance(payload.data));
      toast(payload.message);
      playSound();
    };

    const handlePunchOutUpdated = (payload: any) => {
      dispatch(setTodayAttendance(payload.data));
      toast(payload.message);
      playSound();
    };

    socket.on("attendanceUpdated", handleAttendanceUpdated);
    socket.on("punchOutUpdated", handlePunchOutUpdated);

    return () => {
      disconnectSocket();
      socket.off("attendanceUpdated", handleAttendanceUpdated);
      socket.off("punchOutUpdated", handlePunchOutUpdated);
    };
  }, [dispatch, attendance?.branch, attendance?.userId]);

  const handleApplyAttendance = useCallback(
    async (workingHour: WorkingHour) => {
      setActionLoading(true);
      await dispatch(applyForAttendance(workingHour));
      await dispatch(getTodayAttendance());
      setActionLoading(false);
    },
    [dispatch]
  );

  const handleApplyLeave = useCallback(
    async (reason: string, date: string) => {
      setActionLoading(true);
      await dispatch(applyForLeave(reason, date, date));
      await dispatch(getTodayAttendance());
      setActionLoading(false);
    },
    [dispatch]
  );

  const handleApplyPunchOut = useCallback(async () => {
    setActionLoading(true);
    await dispatch(applyForPunchOut());
    await dispatch(getTodayAttendance());
    setActionLoading(false);
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4">
        <AttendanceStatus
          attendance={attendance}
          actionLoading={actionLoading}
          onApplyAttendance={handleApplyAttendance}
          onApplyLeave={handleApplyLeave}
          onApplyPunchOut={handleApplyPunchOut}
        />
      </div>
    </div>
  );
};

export default Home;