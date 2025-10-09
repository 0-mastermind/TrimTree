import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/user.slice';
import attendanceReducer from './features/attendance.slice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance : attendanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;