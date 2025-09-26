import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { EmployeeEndpoints } from "./apis";
import { setBranchStaff } from "@/store/features/branches/branch.slice";
import { Staff } from "@/types/global";

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
