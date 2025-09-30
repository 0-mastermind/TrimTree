import { apiConnector } from "@/utils/apiConnector";
import { AuthEndpoints } from "./apis";
import type { AppDispatch } from "@/store/store";
import { clearUser, setUser } from "@/store/features/auth/user.slice";
import type { Staff, User } from "@/types/global";
import toast from "react-hot-toast";

export const login =
  (username: string, password: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
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

export const createUser =
  (formData: FormData) => async (): Promise<boolean> => {
    const toastId = toast.loading("Creating");
    try {
      const res = await apiConnector(
        "POST",
        AuthEndpoints.CREATE_USER_API,
        formData
      );
      
      console.log(res);
      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Employee added successfully!");

        return true;
      } else {
        toast.dismiss(toastId);
        toast.error(res.message || "Failed to create user");
      }

      return false;
    } catch (error) {
      console.error("Error! while creating a user", error);
      return false;
    }
  };

export const getProfile =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector("GET", AuthEndpoints.PROFILE_API);

      if (res.success && res.data) {
        const { user } = res.data as {
          user: User;
        };
        dispatch(setUser(user));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Get profile error:", error);
      return false;
    }
  };

export const logout =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector("POST", AuthEndpoints.LOGOUT_API);
      const toastId = toast.loading("Logging Out...");
      
      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Logged Out Successfully!");
        dispatch(clearUser());
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to logout!");
        return false;
      }
    } catch (error) {
      console.error("Error while logging out", error);
      return false;
    }
  };

interface AuthenticateAPIResponse {
  isMatch: boolean
}
  
export const authenticateUser = (password: string) =>  async (): Promise<Boolean> => {
  const toastId = toast.loading("Authenticating");
  try {
    const res = await apiConnector("GET", `${AuthEndpoints.AUTHENTICATE_USER_API}?password=${password}`);
    
    if (res.success && res.data) {
        const data = res.data as AuthenticateAPIResponse;
        
        if (data.isMatch) {
          toast.dismiss(toastId);
          toast.success("Authenticated");
          return true;
        }
    }
    
    toast.dismiss(toastId);
    toast.error("Failed to authenticate!");
    return false;
  } catch (error) {
    console.log("Error! while authenticating user!");
    return false;
  }
}   