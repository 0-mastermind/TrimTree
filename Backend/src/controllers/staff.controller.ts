import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AttendanceModel from "../models/attendance.model.js";
import StaffModel from "../models/staff.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  attendanceType,
  WorkingHour,
  attendanceStatus,
} from "../utils/constants.js";

export const applyForAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;
    const { workingHour } = req.body;

    if (!staffId) {
      throw new ApiError(400, "User Not Logged In");
    }

    const staff = await StaffModel.findById(staffId);
    if (!staff) {
      throw new ApiError(404, "Staff not found");
    }

    // prevent multiple attendance entries for the same day
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existing = await AttendanceModel.findOne({
      staffId,
      date: { $gte: startOfDay, $lte: endOfDay },
      type: attendanceType.ATTENDANCE,
    });

    if (existing) {
      throw new ApiError(400, "Attendance already applied for today");
    }

    const attendance = await AttendanceModel.create({
      staffId,
      type: attendanceType.ATTENDANCE,
      workingHour: workingHour || WorkingHour.FULL_DAY,
      leaveDescription: "",
      status: attendanceStatus.PENDING,
      punchIn: { time: new Date(), isApproved: false },
    });

    return new ApiResponse({
      statusCode: 201,
      message: "Attendance applied successfully",
    }).send(res);
  }
);

export const applyForLeave = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;
    const { dates, leaveDescription } = req.body; // array of dates or single date

    if (!staffId) throw new ApiError(400, "User Not Logged In");

    const staff = await StaffModel.findById(staffId);
    if (!staff) throw new ApiError(404, "Staff not found");

    if (!dates || (Array.isArray(dates) && dates.length === 0))
      throw new ApiError(400, "Please provide at least one date for leave");

    // Normalize to array of Dates
    const leaveDates: Date[] = Array.isArray(dates)
      ? dates.map((d) => new Date(d))
      : [new Date(dates)];

    const createdLeaves = [];

    for (const leaveDate of leaveDates) {
      const startOfDay = new Date(leaveDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(leaveDate.setHours(23, 59, 59, 999));

      const existing = await AttendanceModel.findOne({
        staffId,
        date: { $gte: startOfDay, $lte: endOfDay },
        type: attendanceType.LEAVE,
      });

      if (existing) continue; // skip duplicate leave

      const leave = await AttendanceModel.create({
        staffId,
        type: attendanceType.LEAVE,
        status: attendanceStatus.PENDING,
        leaveDescription: leaveDescription || "",
        date: leaveDate,
      });

      createdLeaves.push(leave);
    }

    if (createdLeaves.length === 0)
      throw new ApiError(400, "Leave already applied for all given dates");


    return new ApiResponse({
      statusCode: 201,
      message: "Leave applied successfully",
    }).send(res);
  }
);

export const getMonthlyAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;
    const { month, year } = req.query; // month: 1-12, year: YYYY

    if (!staffId) throw new ApiError(400, "User Not Logged In");
    if (!month || !year) throw new ApiError(400, "Please provide month and year");

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    const startOfMonth = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const attendance = await AttendanceModel.find({
      staffId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    })
      .sort({ date: 1 }) // ascending by day
      .select("date status type workingHour");

    return new ApiResponse({
      statusCode: 200,
      message: "Monthly attendance fetched successfully",
      data: attendance,
    }).send(res);
  }
);

export const applyForPunchOut = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendance = await AttendanceModel.findOne({
      staffId,
      date: { $gte: startOfDay, $lte: endOfDay },
      type: attendanceType.ATTENDANCE,
    });

    if (!attendance) throw new ApiError(404, "No attendance found for today");
    if (attendance.punchOut?.time) {
      throw new ApiError(400, "Punch-out already applied for today");
    }

    attendance.punchOut = {
      time: new Date(),
      isApproved: false, 
    };

    await attendance.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Punch-out applied successfully, pending approval",
      data: attendance.punchOut,
    }).send(res);
  }
);


