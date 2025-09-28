import { Staff } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EmployeeState {
  employees: Staff[] | [];
}

const initialState: EmployeeState = {
  employees: [],
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (state: EmployeeState, action: PayloadAction<Staff[]>) => {
      state.employees = action.payload;
    },
  },
});

export const { setEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
