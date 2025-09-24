import { apiConnector } from "@/utils/apiConnector";
import { AuthEndpoints } from "./apis";
import type { AppDispatch } from "@/store/store";
import { setStaff, setUser } from "@/store/features/user.slice";
import type { Staff, User } from "@/types/type";
import toast from "react-hot-toast";

export const login =
  (username: string, password: string) => async (dispatch : AppDispatch): Promise<boolean> => {
    const toastId = toast.loading("Logging In...");
    try {
      const res = await apiConnector("POST", AuthEndpoints.LOGIN_API, {
        username,
        password,
      });

      if (res.success && res.data) {
        toast.dismiss(toastId);
        dispatch(setUser(res.data as User));
        toast.success("Logged In");
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss(toastId);
      toast.error("Login failed");
      return false;
    }
  };

export const getProfile =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector("GET", AuthEndpoints.PROFILE_API);

      if (res.success && res.data) {
        const { user, staffData } = res.data as {
          user: User;
          staffData: Staff;
        };
        dispatch(setUser(user));
        dispatch(setStaff(staffData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Get profile error:", error);
      return false;
    }
  };
