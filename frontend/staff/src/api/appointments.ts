import type { AppDispatch } from "@/store/store";
import { apiConnector } from "@/utils/apiConnector";
import { AppointmentsEndpoints } from "./apis";
import { setAppointments } from "@/store/features/appointment.slice";
import type { Appointment } from "@/types/type";

export const getAppointments =
  (id: string) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        AppointmentsEndpoints.GET_APPOINTMENTS_API(id)
      );
            
      if (res.success && res.data) {
        dispatch(setAppointments(res.data as Appointment[]));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error! while fetching appointments", error);
      return false;
    }
  };
