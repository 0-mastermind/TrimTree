import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { BranchEndpoints } from "./apis";
import { setBranches } from "@/store/features/branches/branch.slice";
import { Branch } from "@/types/global";
import toast from "react-hot-toast";

export const getAllBranches =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector("GET", BranchEndpoints.GET_BRANCHES_API);

      if (res.success && res.data) {
        dispatch(setBranches(res.data as Branch[]));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error! while fetching branches", error);
      return false;
    }
  };

export const createBranch =
  (formData: FormData) => async (): Promise<boolean> => {
    const toastId = toast.loading("Creating...");
    try {
      const res = await apiConnector(
        "POST",
        BranchEndpoints.CREATE_BRANCH_API,
        formData
      );

      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Branch Created Successfully!");
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Failed to create branch");
      }

      return false;
    } catch (error) {
      console.error("Error! while creating branches", error);
      return false;
    }
  };


  