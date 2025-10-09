import type { Attendance } from "@/types/type";
import { AnalyticsEndpoints } from "./apis";
import type { AppDispatch } from "@/store/store";
import { setMonthlyAttendance } from "@/store/features/attendance.slice";
import { apiConnector } from "@/utils/apiConnector";
import toast from "react-hot-toast";

export const getMonthlyAttendance = (month : string , year : string) => async (dispatch : AppDispatch): Promise<Attendance[] | null> => {
  try {
    const res = await apiConnector(
      "GET",
      AnalyticsEndpoints.GET_MONTHLY_ATTENDANCE_API + `?month=${month}&year=${year}`,
    );

    if (res.success && res.data) 
    {
        dispatch(setMonthlyAttendance(res.data as Attendance[]));
      return res.data as Attendance[];
    } else{
      toast.error(res.message || "Failed To Load");
      return null;
    }  
    }catch (error) {
    toast.error("Failed To Load");
    console.error("Get monthly attendance error:", error);
    return null;
  }
}