import { useAppSelector } from "@/store/store";
import StaffAppointmentCard from "./StaffAppointmentCard";
import { useEffect, useRef } from "react";
import { getAppointments } from "@/api/appointments";
import { useAppDispatch } from "@/store/hook";
import { connectSocket, disconnectSocket, socket } from "@/lib/socket";
import toast from "react-hot-toast";
import { addAppointment } from "@/store/features/appointment.slice";

const Appointments = () => {
  const { appointments } = useAppSelector((state) => state.appointments);
  const { staff } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!staff?._id) return;

    const fetchData = async () => {
      try {
        await dispatch(getAppointments(staff._id as string));
      } catch (error) {
        console.error("Error while fetching appointments", error);
      }
    };

    fetchData();
  }, [dispatch, staff?._id]);

  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      notifyAudioRef.current = new Audio("/notification.mp3");
    }
  }, []);

  useEffect(() => {
    if (!staff?._id) return;

    connectSocket();

    const handleConnect = () => {
      socket.emit("joinRoom", `staff:${staff._id}`);
    };

    const playSound = () => {
      try {
        notifyAudioRef.current?.play();
      } catch (e) {
        console.error("Error playing notification sound:", e);
      }
    };

    const handleNewAppointment = (payload: { data: any; message: string }) => {
      dispatch(addAppointment(payload.data));
      toast(payload.message);
      playSound();
    };

    socket.on("connect", handleConnect);
    socket.on("newAppointment", handleNewAppointment);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newAppointment", handleNewAppointment);
      disconnectSocket();
    };
  }, [dispatch, staff?._id]);

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
                    appointmentDate={appointment.appointmentAt.split(" ")[0]}
                    appointmentTime={
                      appointment.appointmentAt.split(" ")[1] +
                      " " +
                      appointment.appointmentAt.split(" ")[2]
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
