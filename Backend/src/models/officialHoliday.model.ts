import mongoose, { Model, Schema, model } from "mongoose";
import type { IOfficialHoliday } from "../types/type.js";
import { Branch, EnumWorkingHour, WorkingHour } from "../utils/constants.js";

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
    type: { 
      type: String, 
      enum: EnumWorkingHour, 
      default: WorkingHour.FULL_DAY
    },
    description: {
      type: String, 
      required: true 
    },
    branch: {
      type: String,
      enum: Branch,
      required: true,
    },
  },
  { timestamps: true }
);


const OfficalHolidayModel: Model<IOfficialHoliday> =
  mongoose.models.OfficalHoliday || model<IOfficialHoliday>("OfficalHoliday", OfficialHolidaySchema);
export default OfficalHolidayModel;