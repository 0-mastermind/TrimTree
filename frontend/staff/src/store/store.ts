import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/user.slice';
import attendanceReducer from './features/attendance.slice';
import appointmentsSlice from "./features/appointment.slice";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance : attendanceReducer,
    appointments : appointmentsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;