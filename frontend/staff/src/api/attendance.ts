import type { AppDispatch } from "@/store/store";
import { apiConnector } from "@/utils/apiConnector";
import { AttendanceEndpoints } from "./apis";
import { setTodayAttendance } from "@/store/features/attendance.slice";
import type { Attendance, leaveType, WorkingHour } from "@/types/type";
import toast from "react-hot-toast";

export const getTodayAttendance =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector("GET", AttendanceEndpoints.TODAY_STATUS_API);

      if (res.success && res.data) {
        dispatch(setTodayAttendance(res.data as Attendance));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Get today attendance error:", error);
      return false;
    }
  };

export const applyForAttendance = (workingHour : WorkingHour) => async (dispatch : AppDispatch): Promise<boolean> => {
  const toastId = toast.loading("Applying...");
  try {
    const res = await apiConnector(
      "POST",
      AttendanceEndpoints.APPLY_FOR_ATTENDANCE_API,
      {workingHour}
    );

    if (res.success && res.data) {
      dispatch(setTodayAttendance(res.data as Attendance));
      toast.dismiss(toastId);
      toast.success("Attendance Applied");
      return true;
    }

    else
    {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed To Apply");
      return false;
    }

  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed To Apply");
    console.error("Apply for attendance error:", error);
    return false;
  }
}

export const applyForLeave = (reason : string , type : leaveType , startDate : string , endDate : string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Applying...");
  try {
    const res = await apiConnector(
      "POST",
      AttendanceEndpoints.APPLY_FOR_LEAVE_API,
      {reason, type , startDate , endDate}
    );

    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Leave Applied");
      return true;
    }

    else
    {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed To Apply");
      return false;
    }

  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed To Apply");
    console.error("Apply for leave error:", error);
    return false;
  }
}

export const applyForPunchOut = ( ) => async (dispatch : AppDispatch): Promise<boolean> => {
  const toastId = toast.loading("Applying...");
  try {
    const res = await apiConnector(
      "POST",
      AttendanceEndpoints.APPLY_FOR_PUNCH_OUT_API,
    );

    if (res.success && res.data) {
      dispatch(setTodayAttendance(res.data as Attendance));
      toast.dismiss(toastId);
      toast.success("Punch Out Applied");
      return true;
    }

    else
    {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed To Apply");
      return false;
    }

  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed To Apply");
    console.error("Apply for punch out error:", error);
    return false;
  }
}