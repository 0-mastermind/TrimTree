import type {
  IAppointment,
} from "@/types/global";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface appointmentsState {
  appointments: IAppointment[] | [];
}
const initialState: appointmentsState = {
  appointments: [],
};

const apppointmentsSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<IAppointment[]>) => {
      state.appointments = action.payload;
    },
  },
});

export const { setAppointments } = apppointmentsSlice.actions;
export default apppointmentsSlice.reducer;
