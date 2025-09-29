import type { Attendance, Leave } from "@/types/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AttendanceState {
   todayAttendance: Attendance | null;
   monthlyAttendance: Attendance[] | null;
   leaveHistory: Leave[] | null;
}
const initialState : AttendanceState = {
    todayAttendance: null,
    monthlyAttendance: null,
    leaveHistory: null,
};

const userSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setTodayAttendance: (state : AttendanceState, action: PayloadAction<Attendance>) => {
            state.todayAttendance = action.payload;
        },
        setMonthlyAttendance: (state : AttendanceState, action: PayloadAction<Attendance[]>) => {
            state.monthlyAttendance = action.payload;
        },
        setLeaveHistory: (state : AttendanceState, action: PayloadAction<Leave[]>) => {
            state.leaveHistory = action.payload;
        },
        clearAttendance: (state : AttendanceState) => {
            state.todayAttendance = null;
            state.monthlyAttendance = null;
        },
    },
});

export const { setTodayAttendance, setMonthlyAttendance, clearAttendance , setLeaveHistory} = userSlice.actions;
export default userSlice.reducer;