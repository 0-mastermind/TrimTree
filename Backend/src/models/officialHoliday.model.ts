import mongoose, { Model, Schema, model } from "mongoose";
import type { IOfficialHoliday } from "../types/type.js";

const OfficialHolidaySchema = new Schema<IOfficialHoliday>(
  {
    name: { 
    type: String, 
    required: true
   }, 
   date: { 
      type: Date, 
      required: true
    },
    employees: [{ 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }],
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);


const OfficialHolidayModel: Model<IOfficialHoliday> =
  mongoose.models.OfficialHoliday || model<IOfficialHoliday>("OfficialHoliday", OfficialHolidaySchema);
export default OfficialHolidayModel;