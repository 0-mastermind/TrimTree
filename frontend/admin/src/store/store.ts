import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import userSlice from "./features/auth/user.slice";
import branchSlice from "./features/branches/branch.slice";

export const store = configureStore({
  reducer: {
    auth: userSlice,
    branches: branchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
