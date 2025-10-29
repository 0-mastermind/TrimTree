import type { Attendance, Leave, pendingAttendance, User } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface attendanceState {
    attendances: pendingAttendance[] | null;
    leaves: Leave[] | null;
    punchOuts: pendingAttendance[] | null;
    absenties: Attendance[] | null;
    presenties: Attendance[] | null;
    notapplied: User[] | null;
}
const initialState : attendanceState = {
    attendances: null,
    leaves: null,
    punchOuts: null,
    absenties: null,
    presenties: null,
    notapplied: null,
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
        setAbsenties: (state, action: PayloadAction<Attendance[]>) => {
            state.absenties = action.payload;
        },
        addAbsenties: (state, action: PayloadAction<Attendance>) => {
            if (state.absenties) {
                state.absenties.unshift(action.payload);
            } else {
                state.absenties = [action.payload];
            }
        },
        setPresenties: (state, action: PayloadAction<Attendance[]>) => {
            state.presenties = action.payload;
        },
        addPresenties: (state, action: PayloadAction<Attendance>) => {
            if (state.presenties) {
                state.presenties.unshift(action.payload);
            } else {
                state.presenties = [action.payload];
            }
        },
        setNotapplied: (state, action: PayloadAction<User[]>) => {
            state.notapplied = action.payload;
        }
    },
});

export const { setAttendances , setLeaves , addAttendance , removeAttendance , setPunchOuts , removePunchOut , addPunchOut , addLeaves , removeLeaves , setAbsenties , addAbsenties , setPresenties , addPresenties , setNotapplied } = attendanceSlice.actions;
export default attendanceSlice.reducer;