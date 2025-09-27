import { Branch, BranchManagerByNameState, Staff } from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface BranchState {
  branches: Branch[] | [];
  selectedBranch: Branch | null;
  branchStaff: Staff[] | [];
  branchManagerName: BranchManagerByNameState[] | [];
}

const initialState: BranchState = {
  branches: [],
  selectedBranch: null,
  branchStaff: [],
  branchManagerName: [],
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
    },
    setBranchManagersByBranchName: (state: BranchState, action: PayloadAction<BranchManagerByNameState[]>) => {
      state.branchManagerName = action.payload;
    }
  },
});

export const { setBranches, setSelectedBranch, clearSelectedBranch, setBranchStaff, setBranchManagersByBranchName } = branchSlice.actions;
export default branchSlice.reducer;
