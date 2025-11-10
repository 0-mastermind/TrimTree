import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { ManagerEndpoints } from "./apis";
import { setBranchManagersByBranchName } from "@/store/features/branches/branch.slice";
import { BranchManagerByNameState, OfficialHolidays } from "@/types/global";
import toast from "react-hot-toast";
import { setHolidays } from "@/store/features/holidays/holidays.slice";

export const getManagerNameByBranch =
  (branchId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        `${ManagerEndpoints.GET_MANAGER_BY_BRANCH_NAME_API}?branchId=${branchId}`
      );

      if (res.success && res.data) {
        dispatch(
          setBranchManagersByBranchName(res.data as BranchManagerByNameState[])
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error! while fetching names of manager by branch", error);
      return false;
    }
  };

interface AddOfficialHolidayProps {
  name: string;
  date: string; // format: yy-mm-dd
  employees: string[]; // employeee userIds
}

export const addOfficialHoliday =
  ({ name, date, employees }: AddOfficialHolidayProps) =>
  async (): Promise<boolean> => {
    const toastId = toast.loading("Adding holiday");
    try {
      const res = await apiConnector(
        "POST",
        ManagerEndpoints.ADD_OFFICIAL_HOLIDAY_API,
        { name, date, employees }
      );
      
      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Holiday added successfully!");
        return true;
      }

      toast.dismiss(toastId);
      toast.error(res.message || "Failed! to add holiday");
      return false;
    } catch (error) {
      console.log("Error! while adding holidays", error);
      return false;
    }
  };
  
export const getOfficialHolidays = (month: number, year: number) => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", `${ManagerEndpoints.GET_OFFICIAL_HOLIDAYS_API}?month=${month}&year=${year}`);
    
    if (res.success && res.data) {
      dispatch(setHolidays(res.data as OfficialHolidays[]));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error! fetching official holidays", error);
    return false;
  }
}
