import { setEmployees, setReviews } from "@/store/features/auth/landingPage.slice";
import { Employee, Reviews } from "@/types/type";
import { AppDispatch } from "@/store/store";
import { apiConnector } from "@/utils/apiConnector";
import { LandingPageEndpoints } from "./apis";
export const fetchReviews = () => async (dispatch : AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector(
      "GET",
      LandingPageEndpoints.GET_REVIEWS_API
    );

    if (res.success && res.data) { 
        dispatch(setReviews(res.data as Reviews[]));
        return true;
        } else {
        return false;
        }
  } catch (error) {
    console.error("Error! while fetching reviews", error);
    return false;
  }
}

export const fetchEmployees = () => async (dispatch : AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector(
      "GET",
      LandingPageEndpoints.GET_EMPLOYEES_API
    );

    if (res.success && res.data) { 
        dispatch(setEmployees(res.data as Employee[]));
        return true;
        } else {
        return false;
        }
  } catch (error) {
    console.error("Error! while fetching employees", error);
    return false;
  }
}