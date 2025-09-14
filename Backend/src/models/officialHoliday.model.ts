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
    description: {
      type: String, 
      required: true 
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);


const OfficialHolidayModel: Model<IOfficialHoliday> =
  mongoose.models.OfficalHoliday || model<IOfficialHoliday>("OfficialHoliday", OfficialHolidaySchema);
export default OfficialHolidayModel;