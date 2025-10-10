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
    manager: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    salary: {
      type: Number,
      trim: true,
      required: true,
    },
    bonus: [
      {
        date: {
          type: Date,
        },
        description: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],
    payments: [
      {
        from: {
          type: Date,
        },
        to: {
          type: Date,
        },
        amount: {
          type: Number,
        }
      }
    ]
  },
  { timestamps: true }
);

StaffSchema.index({ userId: 1 }, { unique: true });

const StaffModel: Model<IStaff> =
  mongoose.models.Staff || model<IStaff>("Staff", StaffSchema);
export default StaffModel;
