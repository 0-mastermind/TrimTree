import { Employee, Reviews, Slide } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LandingPageState {
  reviews: Reviews[];
  employees: Employee[];
  slides: Slide[];
  selectedSlide: Slide;
  selectedReview: Reviews;
}

const initialState: LandingPageState = {
  reviews: [],
  employees: [],
  slides: [],
  selectedSlide: {} as Slide,
  selectedReview: {} as Reviews,
};

const landingPageSlice = createSlice({
  name: "landingPage",
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<Reviews[]>) {
      state.reviews = action.payload;
    },
    setEmployees(state, action: PayloadAction<Employee[]>) {
      state.employees = action.payload;
    },
    setSlides(state, action: PayloadAction<Slide[]>) {
      state.slides = action.payload;
    },
    addSlide(state, action: PayloadAction<Slide>) {
      state.slides.push(action.payload);
    },
    setSelectedSlide(state, action: PayloadAction<Slide>) {
      state.selectedSlide = action.payload;
    },
    removeSlide(state, action: PayloadAction<string>) {
      state.slides = state.slides.filter(
        (slide) => slide._id !== action.payload
      );
    },
    removeReview(state, action: PayloadAction<string>) {
      state.reviews = state.reviews.filter(
        (review) => review._id !== action.payload
      );
    },
    setSelectedReview(state, action: PayloadAction<Reviews>) {
      state.selectedReview = action.payload;
      }
  },
});

export const { setReviews, setEmployees, setSlides, addSlide , setSelectedSlide , removeSlide , removeReview , setSelectedReview}  =
  landingPageSlice.actions;

export default landingPageSlice.reducer;
