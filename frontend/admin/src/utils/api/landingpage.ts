import { AppDispatch } from "@/store/store";
import { apiConnector } from "../apiConnector";
import { LandingPageEndpoints } from "./apis";
import { Reviews, Slide } from "@/types/global";
import { addSlide, setReviews, setSelectedReview, setSelectedSlide, setSlides } from "@/store/features/landingpage/landingPage.slice";
import toast from "react-hot-toast";

export const fetchSlides =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        LandingPageEndpoints.GET_SLIDERS_API
      );
      if (res.success && res.data) {
        dispatch(setSlides(res.data as Slide[]));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
      return false;
    }
  };

export const fetchSlideById =
  (id: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        LandingPageEndpoints.GET_SLIDER_BY_ID_API(id)
      );
      if (res.success && res.data) {
        dispatch(setSelectedSlide(res.data as Slide));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching slide by ID:", error);
      return false;
    }
  };

  export const deleteSlide = (id: string) => async (): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "DELETE",
        LandingPageEndpoints.DELETE_SLIDER_API(id)
      );
      return res.success;
    } catch (error) {
      console.error("Error deleting slide:", error);
      return false;
    }
  };

    export const createSlide = (formData: FormData) => async (dispatch : AppDispatch): Promise<boolean> => {
      const toastId = toast.loading("Creating slide...");
    try {
      const res = await apiConnector(
        "POST",
        LandingPageEndpoints.CREATE_SLIDER_API,
        formData,
      );
      
      if (res.success && res.data) {
        toast.dismiss(toastId);
        toast.success("Slide created successfully");
        dispatch(addSlide(res.data as Slide));
        return true;
      }
      else { 
        toast.dismiss(toastId);
        toast.error("Failed to create slide");
        return false; 
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error creating slide:", error);
      return false;
    }
  };

    export const updateSlide = (id: string, formData: FormData) => async (): Promise<boolean> => {
    const toastId = toast.loading("Updating slide...");
    try {
      const res = await apiConnector(
        "PATCH",
        LandingPageEndpoints.UPDATE_SLIDER_API(id),
        formData,
      );
      if (res.success) {
        toast.dismiss(toastId);
        toast.success("Slide updated successfully");
        return true;
      }
      else { 
        toast.dismiss(toastId);
        toast.error("Failed to update slide");
        return false; 
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error updating slide:", error);
      toast.error("Failed to update slide");
      return false;
    }
  };

  export const deleteSlideById = (id: string) => async (): Promise<boolean> => {
    const toastId = toast.loading("Deleting slide...");
    try {
      const res = await apiConnector(
        "DELETE",
        LandingPageEndpoints.DELETE_SLIDER_API(id)
      );      
      if (res.success) {
        toast.success("Slide deleted successfully");
        toast.dismiss(toastId);
        return true;
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to delete slide");
        return false;
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
      return false;
    }
  };

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

export const createReview = (customerName : string , service : string , rating : number , comment : string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Creating review...");
  try {
    const res = await apiConnector(
      "POST",
      LandingPageEndpoints.CREATE_REVIEW_API,
      { customerName, service, rating, comment },
    );
    
    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Review created successfully");
      return true;
    }
    else { 
      toast.dismiss(toastId);
      toast.error("Failed to create review");
      return false; 
    }
  } catch (error) {
    toast.dismiss(toastId);
    console.error("Error creating review:", error);
    return false;
  }
}

export const deleteReview = (id: string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Deleting review...");
  try {
    const res = await apiConnector(
      "DELETE",
      LandingPageEndpoints.DELETE_REVIEW_API(id)
    );      
    if (res.success) {
      toast.success("Review deleted successfully");
      toast.dismiss(toastId);
      return true;
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to delete review");
      return false;
    }
  } catch (error) {
    toast.dismiss(toastId);
    console.error("Error deleting review:", error);
    toast.error("Failed to delete review");
    return false;
  }
};  

export const updateReview = (id: string, customerName : string , service : string , rating : number , comment : string) => async (): Promise<boolean> => {
  const toastId = toast.loading("Updating review...");
  try {
    const res = await apiConnector(
      "PATCH",
      LandingPageEndpoints.UPDATE_REVIEW_API(id),
      {customerName, service, rating, comment},
    );
    if (res.success) {
      toast.dismiss(toastId);
      toast.success("Review updated successfully");
      return true;
    }
    else { 
      toast.dismiss(toastId);
      toast.error("Failed to update review");
      return false; 
    }
  } catch (error) {
    toast.dismiss(toastId);
    console.error("Error updating review:", error);
    toast.error("Failed to update review");
    return false;
  }
}

export const fetchReviewById =
  (id: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        LandingPageEndpoints.GET_REVIEW_BY_ID_API(id)
      );
      if (res.success && res.data) {
        dispatch(setSelectedReview(res.data as Reviews));
        return true;
      } else {
        return false;
      }         
    } catch (error) {
      console.error("Error fetching review by ID:", error);
      return false;
    }
  };