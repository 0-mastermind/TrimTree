import { Attendance, pendingAttendance } from "@/types/global";
import { apiConnector } from "../apiConnector";
import { AttendanceEndpoints } from "./apis";
import { AppDispatch } from "@/store/store";
import toast from "react-hot-toast";
import { setAttendances } from "@/store/features/attendance/attendance.slice";

export const fetchPendingAttendance =
  () => async (dispatch : AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        AttendanceEndpoints.PENDING_ATTENDANCE_API
      ); 
      
      if (res.success && res.data) {
        dispatch(setAttendances(res.data as pendingAttendance[]));
        return true;
      } else {
        toast.error(res.message || "Failed load data");
        return false;
      }
    } catch (error) {
      console.error("Error! while fetching attendance", error);
      return false;
    }
};

export const approveAttendance = (id:string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Approving...");
  try {
    const res = await apiConnector(
      "PATCH",
      AttendanceEndpoints.APPROVE_ATTENDANCE_API,
      { attendanceId: id }
    );
    if (res.success) {
      toast.dismiss(toastId);
      toast.success(res.message || "Attendance approved");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to approve");
      return false;
    }
  } catch (error) {
    toast.dismiss
    console.error("Error! while approving attendance", error);
    toast.error("Unable to approve");
    return false;
  }
}

export const rejectAttendance = (id:string) =>  async (): Promise<boolean> => {
  const toastId = toast.loading("Rejecting...");
  try {
    const res = await apiConnector(
      "PATCH",
      AttendanceEndpoints.REJECT_ATTENDANCE_API,
      { attendanceId: id }
    );
    if (res.success) {
      toast.dismiss(toastId);
      toast.success(res.message || "Attendance rejected");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to reject");
      return false;
    }
  } catch (error) {
    toast.dismiss
    console.error("Error! while rejecting attendance", error);
    toast.error("Unable to reject");
    return false;
  }
}

export const dismissAttendance = (id:string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Dismissing...");
  try {
    const res = await apiConnector(
      "PATCH",
      AttendanceEndpoints.DISMISS_ATTENDANCE_API,
      { attendanceId: id }
    );
    if (res.success) {
      toast.dismiss(toastId);
      toast.success(res.message || "Leave dismissed");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to dismiss");
      return false;
    }
  } catch (error) {
    toast.dismiss
    console.error("Error! while dismissing leave", error);
    toast.error("Unable to dismiss");
    return false;
  }
}

export const approvePunchOut = (id:string) =>  async (): Promise<boolean> => {
  const toastId = toast.loading("Approving...");
  try {
    const res = await apiConnector(
      "PATCH",
      AttendanceEndpoints.APPROVE_PUNCHOUT_API,
      { attendanceId: id }
    );
    if (res.success) {
      toast.dismiss(toastId);
      toast.success(res.message || "Punch out approved");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to approve");
      return false;
    }
  } catch (error) {
    toast.dismiss
    console.error("Error! while approving punch out", error);
    toast.error("Unable to approve");
    return false;
  }
}

export const rejectPunchOut = (id:string) =>  async (): Promise<boolean> => {
  const toastId = toast.loading("Rejecting...");
  try {
    const res = await apiConnector(
      "PATCH",
      AttendanceEndpoints.REJECT_PUNCHOUT_API,
      { attendanceId: id }
    );
    if (res.success) {
      toast.dismiss(toastId);
      toast.success(res.message || "Punch out rejected");
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error(res.message || "Failed to reject");
      return false;
    }
  } catch (error) {
    toast.dismiss
    console.error("Error! while rejecting punch out", error);
    toast.error("Unable to reject");
    return false;
  }
}