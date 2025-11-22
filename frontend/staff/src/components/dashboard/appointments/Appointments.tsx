import { useAppSelector } from "@/store/store";
import StaffAppointmentCard from "./StaffAppointmentCard";
import { useEffect } from "react";
import { getAppointments } from "@/api/appointments";
import { useAppDispatch } from "@/store/hook";

const Appointments = () => {
  const { appointments } = useAppSelector((state) => state.appointments);
  const { staff } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const data = async () => {
      try {
        await dispatch(getAppointments(staff?._id as string));
      } catch (error) {
        console.error("Error! while fetching appointments", error);
      }
    };

    data();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8 p-4 sm:p-6">
          <div className="border-b border-gray-200 mb-6 pb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              My Appointments
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your upcoming appointments
            </p>
          </div>

          {appointments && appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {appointments.map((appointment) => (
                <StaffAppointmentCard
                  key={appointment._id}
                  customerName={appointment.customerName}
                  appointmentDate={appointment.appointmentAt.split("T")[0]}
                  appointmentTime={
                    appointment.appointmentAt.split("T")[1].split(".")[0]
                  }
                  description={appointment.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No appointments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
