import type {
  OfficialHolidays,
} from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface HolidaysState {
  holidays: OfficialHolidays[] | [];
}

const initialState: HolidaysState = {
  holidays: [],
};

const holidaysSlice = createSlice({
  name: "holidays",
  initialState,
  reducers: {
    setHolidays: (
      state: HolidaysState,
      action: PayloadAction<OfficialHolidays[]>
    ) => {
      state.holidays = action.payload;
    },
  },
});

export const { setHolidays } = holidaysSlice.actions;
export default holidaysSlice.reducer;