import type { Leave, pendingAttendance } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface attendanceState {
    attendances: pendingAttendance[] | null;
    leaves: Leave[] | null;
    punchOuts: pendingAttendance[] | null;
}
const initialState : attendanceState = {
    attendances: null,
    leaves: null,
    punchOuts: null,
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        setAttendances: (state, action: PayloadAction<pendingAttendance[]>) => {
            state.attendances = action.payload;
        },
        setLeaves: (state, action: PayloadAction<Leave[]>) => {
            state.leaves = action.payload;
        },
        addLeaves: (state, action: PayloadAction<Leave>) => {
            if (state.leaves) {
                state.leaves.unshift(action.payload);
            } else {
                state.leaves = [action.payload];
            }
        },
        removeLeaves: (state, action: PayloadAction<string>) => {
            if (state.leaves) {
                state.leaves = state.leaves.filter(leave => leave._id !== action.payload);
            }
        },
        addAttendance: (state, action: PayloadAction<pendingAttendance>) => {
            if (state.attendances) {
                state.attendances.unshift(action.payload);
            } else {
                state.attendances = [action.payload];
            }
        },
        removeAttendance: (state, action: PayloadAction<string>) => {
            if (state.attendances) {
                state.attendances = state.attendances.filter(att => att._id !== action.payload);
            }
        },
        setPunchOuts: (state, action: PayloadAction<pendingAttendance[]>) => {
            state.punchOuts = action.payload;
        },
        addPunchOut: (state, action: PayloadAction<pendingAttendance>) => {
            if (state.punchOuts) {
                state.punchOuts.unshift(action.payload);
            } else {
                state.punchOuts = [action.payload];
            }
        },
        removePunchOut: (state, action: PayloadAction<string>) => {
            if (state.punchOuts) {
                state.punchOuts = state.punchOuts.filter(att => att._id !== action.payload);
            }
        },
    },
});

export const { setAttendances , setLeaves , addAttendance , removeAttendance , setPunchOuts , removePunchOut , addPunchOut , addLeaves , removeLeaves} = attendanceSlice.actions;
export default attendanceSlice.reducer;