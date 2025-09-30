import { Attendance, EmployeeAnalyticsState, Staff } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EmployeeState {
  employees: Staff[] | [];
  selectedEmployee: Staff | null;
  employeeAnalytics: EmployeeAnalyticsState | null;
  monthlyAttendance: Attendance[] | [];
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  employeeAnalytics: null,
  monthlyAttendance: [],
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (state: EmployeeState, action: PayloadAction<Staff[]>) => {
      state.employees = action.payload;
    },
    setSelectedEmployee: (state: EmployeeState, action: PayloadAction<Staff>) => {
      state.selectedEmployee = action.payload;
    },
    setEmployeeAnalytics: (state: EmployeeState, action: PayloadAction<EmployeeAnalyticsState>) => {
      state.employeeAnalytics = action.payload;
    },
    setMonthlyAttendance: (state: EmployeeState, action: PayloadAction<Attendance[]>) => {
      state.monthlyAttendance = action.payload;
    },
  },
});

export const { setEmployees, setSelectedEmployee, setEmployeeAnalytics, setMonthlyAttendance } = employeeSlice.actions;
export default employeeSlice.reducer;
