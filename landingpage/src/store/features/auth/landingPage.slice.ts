import { Demo, Employee, Reviews } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface landngPageState {
  reviews: Reviews[] | [];
  employees: Employee[] | [];
}

const initialState: landngPageState = {
  reviews : [],
  employees: [],
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
  },
});

export const { setReviews , setEmployees } = landingPageSlice.actions;
export default landingPageSlice.reducer;
