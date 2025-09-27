import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { ManagerEndpoints } from "./apis";
import { setBranchManagersByBranchName } from "@/store/features/branches/branch.slice";
import { BranchManagerByNameState } from "@/types/global";

export const getManagerNameByBranch =
  (branchId: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        `${ManagerEndpoints.GET_MANAGER_BY_BRANCH_NAME}?branchId=${branchId}`
      );
      
      if (res.success && res.data) {
        dispatch(setBranchManagersByBranchName(res.data as BranchManagerByNameState[]));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error! while fetching names of manager by branch", error);
      return false;
    }
  };
