import { Staff } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ManagerState {
  staff: Staff[] | null;
}

const initialState: ManagerState = {
  staff: null,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    setManager: (state: ManagerState, action: PayloadAction<Staff[]>) => {
      state.staff = action.payload;
    },
  },
});

export const {setManager } = managerSlice.actions;
export default managerSlice.reducer;