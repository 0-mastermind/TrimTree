import mongoose, { model, Model, Schema } from "mongoose";
import type { IAppointments } from "../types/type.js";

const AppointmentSchema = new Schema<IAppointments>(
  {
    customerName: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedStaffMember: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    appointmentAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel: Model<IAppointments> = model<IAppointments>(
  "Appointment",
  AppointmentSchema
);

export default AppointmentModel;