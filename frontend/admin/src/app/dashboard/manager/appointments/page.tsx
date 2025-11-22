"use client";
import AppointmentCard from "@/components/Manager/AppointmentCard";
import AddAppointmentDailogue from "@/components/Manager/AppointmentDailogue";
import EditAppointmentDailogue from "@/components/Manager/EditAppointmentDailogueBox";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { deleteAppointment, getAllAppointments } from "@/utils/api/appointment";
import { getStaffByManager } from "@/utils/api/manager";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Appointments = () => {
  const dispatch = useAppDispatch();
  const { appointments } = useAppSelector((state) => state.appointment);
  const [isDialogueBoxOpen, setIsDailogueBoxOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState<any>(null);

  useEffect(() => {
    const data = async () => {
      try {
        await dispatch(getStaffByManager());
        await dispatch(getAllAppointments());
      } catch (error) {
        console.error("Error! while fetching appointments", error);
      }
    };

    data();
  }, [dispatch]);

  const handleEdit = (appointment: any) => {
    setEditAppointment({
      _id: appointment._id,
      customerName: appointment.customerName,
      appointmentAt: appointment.appointmentAt, 
      assignedStaffMember: appointment.assignedStaffMember._id,
      description: appointment.description,
    });
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const res = await dispatch(deleteAppointment({ id: appointmentId }));

      if (res) {
        await dispatch(getAllAppointments());
      }
    } catch (error) {
      console.error("Error! while fetching appointments", error);
    }
  };

  return (
    <div className="px-10">
      {/* assign appointments button */}
      <div className="flex justify-end">
        <button
          className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
          onClick={() => setIsDailogueBoxOpen(true)}
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden md:block">Add an appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 my-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((item: any) => {
            return (
              <AppointmentCard
                key={item._id}
                customerName={item.customerName}
                appointmentAt={item.appointmentAt}
                assignedStaffMember={`${item.assignedStaffMember.userId.name} - ${item.assignedStaffMember.designation}`}
                description={item.description}
                onEdit={() => handleEdit(item)}
                onCancel={() => handleCancel(item._id)}
              />
            );
          })
        ) : (
          <p>No appointments</p>
        )}
      </div>

      {isDialogueBoxOpen && (
        <AddAppointmentDailogue onClose={() => setIsDailogueBoxOpen(false)} />
      )}

      {editAppointment && (
        <EditAppointmentDailogue
          appointment={editAppointment}
          onClose={() => setEditAppointment(null)}
        />
      )}
    </div>
  );
};

export default Appointments;