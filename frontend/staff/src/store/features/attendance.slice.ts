import type { Attendance } from "@/types/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AttendanceState {
   todayAttendance: Attendance | null;
   monthlyAttendance: Attendance[] | null;
}
const initialState : AttendanceState = {
    todayAttendance: null,
    monthlyAttendance: null,
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
        clearAttendance: (state : AttendanceState) => {
            state.todayAttendance = null;
            state.monthlyAttendance = null;
        },
    },
});

export const { setTodayAttendance, setMonthlyAttendance, clearAttendance } = userSlice.actions;
export default userSlice.reducer;