import { Branch, Staff } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BranchState {
  branches: Branch[] | [];
  selectedBranch: Branch | null;
  branchStaff: Staff[] | [];
}

const initialState: BranchState = {
  branches: [],
  selectedBranch: null,
  branchStaff: [],
};

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {
    setBranches: (state: BranchState, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload;
    },
    setSelectedBranch: (state: BranchState, action: PayloadAction<Branch>) => {
      state.selectedBranch = action.payload;
    },
    clearSelectedBranch: (state: BranchState) => {
      state.selectedBranch = null;
    },
    setBranchStaff: (state: BranchState, action: PayloadAction<Staff[]>) => {
      state.branchStaff = action.payload;
    }
  },
});

export const { setBranches, setSelectedBranch, clearSelectedBranch, setBranchStaff } = branchSlice.actions;
export default branchSlice.reducer;
