import type { Appointment } from "@/types/type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppointmentsState {
  appointments: Appointment[] | null;
}

const intialState: AppointmentsState = {
  appointments: null,
};


const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: intialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      if (state.appointments) {
        state.appointments.unshift(action.payload);
      } else {
        state.appointments = [action.payload];
      }
    },
  },
});

export const { setAppointments  , addAppointment} = appointmentsSlice.actions;
export default appointmentsSlice.reducer;