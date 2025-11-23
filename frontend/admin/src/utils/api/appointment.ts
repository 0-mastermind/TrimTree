import { AppDispatch } from "@/store/store";
import { AppointmentsEndpoints } from "./apis";
import { apiConnector } from "../apiConnector";
import { setAppointments } from "@/store/features/appointments/appointments.slice";
import { IAppointment } from "@/types/global";
import toast from "react-hot-toast";

export const getAllAppointments =
  () =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "GET",
        AppointmentsEndpoints.GET_ALL_APPOINTMENTS_API
      );      
      // TODO: POINT BACKEND TO STORE MANAGER ID TOO...
      if (res.success && res.data) {
        dispatch(setAppointments(res.data as IAppointment[]));

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error! while fetching appointments", error);
      return false;
    }
  };

interface CreateAppointmentProps {
  customerName: string;
  description: string;
  appointmentAt: string;
  assignedStaffMember: string;
}

export const createAppointment =
  ({ formData }: { formData: CreateAppointmentProps }) =>
  async (): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "POST",
        AppointmentsEndpoints.CREATE_APPOINTMENT_API,
        {
          customerName: formData.customerName,
          description: formData.description,
          appointmentAt: formData.appointmentAt,
          assignedStaffMember: formData.assignedStaffMember,
        }
      );

      if (res.success) {
        toast.success("Appointment created successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error! while fetching appointments", error);
      return false;
    }
  };

export const updateAppointment =
  ({ id, formData }: { id: string; formData: CreateAppointmentProps }) =>
  async (): Promise<boolean> => {
    try {
      const res = await apiConnector(
        "PATCH",
        AppointmentsEndpoints.UPDATE_APPOINTMENT_API(id),
        {
          customerName: formData.customerName,
          description: formData.description,
          appointmentAt: formData.appointmentAt,
          assignedStaffMember: formData.assignedStaffMember,
        }
      );
      
      
      if (res) {
        toast.success("Appointment updated successfully!");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error! while fetching appointments", error);
      return false;
    }
  };

  
  export const deleteAppointment = 
    ({ id }: { id: string }) =>
    async (): Promise<boolean> => {
      try {
        const res = await apiConnector(
          "DELETE",
          AppointmentsEndpoints.DELETE_APPOINTMENT_API(id)
        );
        
        if (res) {
          toast.success("Appointment deleted successfully!");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error! while fetching appointments", error);
        return false;
      }
    };