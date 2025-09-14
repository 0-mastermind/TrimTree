import mongoose, { Model, Schema, model } from "mongoose";
import type { IAttendance } from "../types/type.js";
import {
  attendanceStatus,
  attendanceType,
  EnumAttendanceType,
  EnumPunchOutStatus,
  EnumWorkingHour,
  punchOutStatus,
  WorkingHour,
} from "../utils/constants.js";

const AttendanceSchema = new Schema<IAttendance>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type : Schema.Types.ObjectId,
      ref : "Branch",
      required : true
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String, 
      enum: EnumAttendanceType,
      required: true,
      default: attendanceType.ATTENDANCE,
    },
    workingHour : {
      type : String,
      enum : EnumWorkingHour,
      default : WorkingHour.FULL_DAY
    },
    punchIn: {
      time : {
        type: Date,
      },
      isApproved : {
        type: Boolean,
        default: false,
      }
    },
    punchOut: {
      time : {
        type: Date,
      },
      isApproved : {
        type: Boolean,
        default: false,
      },
       status : {
        type : String,
        enum : EnumPunchOutStatus,
        default : punchOutStatus.NOT_APPLIED,
      }
    },
    status: {
      type: String,
      enum: attendanceStatus,
      default: attendanceStatus.PENDING,
    },
    leaveDescription: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

AttendanceSchema.index({ staffId: 1, date: -1 });  
AttendanceSchema.index({ staffId: 1, status: 1 });
AttendanceSchema.index({ date: 1 }); 

const AttendanceModel: Model<IAttendance> =
  mongoose.models.Attendance ||
  model<IAttendance>("Attendance", AttendanceSchema);
export default AttendanceModel;
