import mongoose, { Model, Schema, model } from "mongoose";
import type { IAttendance } from "../types/type.js";
import { attendanceStatus, EnumWorkingHour, WorkingHour  } from "../utils/constants.js";

const AttendanceSchema = new Schema<IAttendance>(
  {
     staffId: { 
        type: Schema.Types.ObjectId, 
        ref: "Staff", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true,
        default: Date.now()
    },
    type: {
        type: String, 
        enum: EnumWorkingHour,
        default: WorkingHour.FULL_DAY
        },

    status: { 
        type: String, 
        enum: attendanceStatus,
        default: attendanceStatus.PENDING
     },
    leaveDescription: {
        type: String,
        trim: true,
        default: ""
    }
  },
  { timestamps: true }
);


const AttendanceModel: Model<IAttendance> =
  mongoose.models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);
export default AttendanceModel;