import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './features/loader.slice';
import authReducer from './features/user.slice';
export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;