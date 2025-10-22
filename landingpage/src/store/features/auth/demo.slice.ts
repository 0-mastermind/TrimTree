import { Demo } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  Demo : Demo | null;
}

const initialState: AuthState = {
  Demo : null,
};

const demoSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<Demo | null>) {
      state.Demo = action.payload;
    },
    clearAdmin(state) {
      state.Demo = null;
    }
  },
});

export const { setAdmin , clearAdmin } = demoSlice.actions;
export default demoSlice.reducer;
