import { Employee, Reviews, Slider } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface landngPageState {
  reviews: Reviews[] | [];
  employees: Employee[] | [];
  sliders: Slider[] | [];
}

const initialState: landngPageState = {
  reviews : [],
  employees: [],
  sliders: [],
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
    setSliders(state, action: PayloadAction<Slider[]>) {
      state.sliders = action.payload;
    },
  },
});

export const { setReviews , setEmployees , setSliders} = landingPageSlice.actions;
export default landingPageSlice.reducer;
