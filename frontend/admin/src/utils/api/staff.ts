import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { EmployeeEndpoints } from "./apis";
import { setBranchStaff } from "@/store/features/branches/branch.slice";
import { Staff } from "@/types/global";
import { setEmployees } from "@/store/features/employee/employee.slice";

export const getBranchEmployees = (branchId: string) => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", `${EmployeeEndpoints.GET_BRANCH_EMPLOYEES_API}?branchId=${branchId}`);
    
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

export const getAllEmployees = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", EmployeeEndpoints.GET_ALL_EMPLOYEES_API);
        
    if (res.success && res.data) {
      dispatch(setEmployees(res.data as Staff[]));
      return false;
    }
    
    return false;
  } catch (error) {
    console.error("Error! while getting employees list", error);
    return false;
  }
}

export const getEmployeesByManager = () => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector("GET", EmployeeEndpoints.GET_EMPLOYEES_BY_MANAGER_API);
        
    if (res.success && res.data) {
      dispatch(setEmployees(res.data as Staff[]));
      return false;
    }
    
    return false;
  } catch (error) {
    console.error("Error! while getting employees list", error);
    return false;
  }
}