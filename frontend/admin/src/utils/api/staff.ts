import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { EmployeeEndpoints } from "./apis";
import { setBranchStaff } from "@/store/features/branches/branch.slice";
import {
  Attendance,
  Bonus,
  EmployeeAnalyticsState,
  Payment,
  Staff,
} from "@/types/global";
import {
  setEmployeeAnalytics,
  setEmployees,
  setMonthlyAttendance,
  setSelectedEmployee,
} from "@/store/features/employee/employee.slice";
import toast from "react-hot-toast";

export const getBranchEmployees =
  (branchId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        `${EmployeeEndpoints.GET_BRANCH_EMPLOYEES_API}?branchId=${branchId}`
      );

      if (res.success && res.data) {
        dispatch(setBranchStaff(res.data as Staff[]));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error! while fetching branch employees", error);
      return false;
    }
  };

export const getAllEmployees =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        EmployeeEndpoints.GET_ALL_EMPLOYEES_API
      );

      if (res.success && res.data) {
        dispatch(setEmployees(res.data as Staff[]));
        return false;
      }

      return false;
    } catch (error) {
      console.error("Error! while getting employees list", error);
      return false;
    }
  };

export const getEmployeesByManager =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        EmployeeEndpoints.GET_EMPLOYEES_BY_MANAGER_API
      );

      if (res.success && res.data) {
        dispatch(setEmployees(res.data as Staff[]));
        return false;
      }

      return false;
    } catch (error) {
      console.error("Error! while getting employees list", error);
      return false;
    }
  };

export const getSpecificEmployeeDetails =
  (staffId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        `${EmployeeEndpoints.GET_SPECIFIC_EMPLOYEE_API}?staffId=${staffId}`
      );

      if (res.success && res.data) {
        dispatch(setSelectedEmployee(res.data as Staff));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error! while getting selected employee", error);
      return false;
    }
  };

interface EmployeeAnalyticsAPIProps {
  userId: string;
  staffId: string;
  date: string;
}

export const getSpecificEmployeeAnalytics =
  ({ userId, staffId, date }: EmployeeAnalyticsAPIProps) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        `${EmployeeEndpoints.GET_SPECIFIC_EMPLOYEE_ANALYTICS_API}?staffId=${staffId}&userId=${userId}&startingDate=${date}`
      );

      if (res.success && res.data) {
        dispatch(setEmployeeAnalytics(res.data as EmployeeAnalyticsState));

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error! while fetching analytics from api", error);
      return false;
    }
  };

export const addEmployeeBonus =
  ({ formData, staffId }: { formData: Bonus; staffId: string }) =>
  async (): Promise<boolean> => {
    const toastId = toast.loading("Adding bonus!");
    try {
      const res = await apiConnector(
        "PATCH",
        `${EmployeeEndpoints.ADD_EMPLOYEE_BONUS_API}?staffId=${staffId}`,
        {
          date: formData.date,
          amount: formData.amount,
          description: formData.description,
        }
      );

      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Bonus added successfully!");
        return true;
      }

      toast.dismiss(toastId);
      toast.error("Failed to add bonus!");
      return false;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to add bonus!");
      console.error("Error while adding employee bonus", error);

      return false;
    }
  };

export const removeEmployeeBonus =
  ({ date, staffId }: { date: string; staffId: string }) =>
  async (): Promise<boolean> => {
    const toastId = toast.loading("Removing Bonus!");
    try {
      const res = await apiConnector(
        "DELETE",
        `${EmployeeEndpoints.REMOVE_EMPLOYEE_BONUS_API}?date=${date}&staffId=${staffId}`
      );

      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Remove bonus successfully!");
        return true;
      }

      toast.dismiss(toastId);
      toast.error("Failed to remove bonus!");
      return false;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to remove bonus!");
      console.error("Error while adding employee bonus", error);

      return false;
    }
  };

export const markEmployeePaymentAsPaid =
  ({ data, staffId }: { data: Payment; staffId: string }) =>
  async (): Promise<boolean> => {
    const toastId = toast.loading("Marking salary");
    try {
      const res = await apiConnector(
        "POST",
        `${EmployeeEndpoints.MARK_PAYMENT_API}?staffId=${staffId}`,
        { from: data.from, to: data.to, amount: data.amount }
      );

      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Payment marked successfully!");
        return true;
      }

      toast.dismiss(toastId);
      toast.error("Failed to mark payment");
      return false;
    } catch (error) {
      console.error("Error! while marking payment", error);
      return false;
    }
  };

export const getMonthlyAttendance =
  (month: string, year: string, staffId: string) =>
  async (dispatch: AppDispatch): Promise<Attendance[] | null> => {
    try {
      const res = await apiConnector(
        "GET",
        `${EmployeeEndpoints.GET_EMPLOYEE_MONTHLY_ATTENDANCE_API}?month=${month}&year=${year}&staffId=${staffId}`
      );

      if (res.success && res.data) {
        dispatch(setMonthlyAttendance(res.data as Attendance[]));
        return res.data as Attendance[];
      } else {
        toast.error(res.message || "Failed To Load");
        return null;
      }
    } catch (error) {
      toast.error("Failed To Load");
      console.error("Get monthly attendance error:", error);
      return null;
    }
  };

  
export const deleteStaffMember = (staffId: string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Deleting employee");
  try {
    const res = await apiConnector("DELETE", `${EmployeeEndpoints.DELETE_STAFF_API}?staffId=${staffId}`);
    
    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Employee deleted successfully!");
      return true;
    }
    
    toast.dismiss(toastId);
    toast.error("Failed to delete employee!");
    return false;
  } catch (error) {
    console.log("Error! while deleting the user", error);
    return false;
  }
}