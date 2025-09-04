import mongoose, { model, Model, Schema } from "mongoose";
import type { IStaff } from "../types/type.js";

const StaffSchema = new Schema<IStaff>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    designation: {
      type: String,
      trim: true,
    },
    manager:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    salary: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

StaffSchema.index({ userId: 1 }, { unique: true });

const StaffModel: Model<IStaff> =
  mongoose.models.Staff || model<IStaff>("Staff", StaffSchema);
export default StaffModel;
