import mongoose, { Model, Schema, model } from "mongoose";
import type { IAttendance, IOfficialHoliday, IUser } from "../types/type.js";
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
    }},
    // Branch
  { timestamps: true }
);


const OfficalHolidayModel: Model<IOfficialHoliday> =
  mongoose.models.OfficalHoliday || model<IOfficialHoliday>("OfficalHoliday", OfficialHolidaySchema);
export default OfficalHolidayModel;