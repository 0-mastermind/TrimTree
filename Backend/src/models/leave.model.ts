import mongoose, { Schema, Model, model } from "mongoose";
import { EnumLeaveStatus, leaveStatus } from "../utils/constants.js";
import type { ILeave } from "../types/type.js";

const LeaveSchema = new Schema<ILeave>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: EnumLeaveStatus,
      default: leaveStatus.PENDING,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const LeaveModel: Model<ILeave> =
  mongoose.models.Leave || model<ILeave>("Leave", LeaveSchema);

export default LeaveModel;
