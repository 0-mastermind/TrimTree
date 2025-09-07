import { DemoState } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  Demo : DemoState | null;
}

const initialState: AuthState = {
  Demo : null,
};

const demoSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<DemoState | null>) {
      state.Demo = action.payload;
    },
    clearAdmin(state) {
      state.Demo = null;
    }
  },
});

export const { setAdmin , clearAdmin } = demoSlice.actions;
export default demoSlice.reducer;
