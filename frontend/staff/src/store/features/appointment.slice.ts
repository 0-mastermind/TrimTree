import type { IAppointment } from "@/types/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppointmentsState {
  appointments: IAppointment[] | null;
}

const intialState: AppointmentsState = {
  appointments: null,
};


const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: intialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<IAppointment[]>) => {
      state.appointments = action.payload;
    },
  },
});

export const { setAppointments } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;