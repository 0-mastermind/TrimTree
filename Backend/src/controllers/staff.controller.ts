import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AttendanceModel from "../models/attendance.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  attendanceType,
  WorkingHour,
  attendanceStatus,
  leaveType,
  leaveStatus,
  punchOutStatus,
} from "../utils/constants.js";
import UserModel from "../models/user.model.js";
import LeaveModel from "../models/leave.model.js";

export const applyForAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const branchId = req.branchId;
    const { workingHour } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // today's start & end
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // check existing attendance entry
    const existingAttendance = await AttendanceModel.findOne({
      staffId: userId,
      branch: branchId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingAttendance) {
      if (
        existingAttendance.status !== attendanceStatus.REJECTED_LEAVE &&
        existingAttendance.status !== attendanceStatus.DISMISSED
      ) {
        throw new ApiError(400, "Attendance already applied for today");
      }

      if (
        existingAttendance.status === attendanceStatus.REJECTED_LEAVE ||
        existingAttendance.status === attendanceStatus.DISMISSED
      ) {
        existingAttendance.type = attendanceType.ATTENDANCE;
        existingAttendance.status = attendanceStatus.PENDING;
        existingAttendance.workingHour = workingHour || WorkingHour.FULL_DAY;
        existingAttendance.leaveDescription = "";
        existingAttendance.punchIn = { time: new Date(), isApproved: false };
        await existingAttendance.save();

        return new ApiResponse({
          statusCode: 200,
          message: "Attendance applied successfully",
        }).send(res);
      }
    }

    // create fresh attendance if nothing exists
    await AttendanceModel.create({
      staffId: userId,
      branch: branchId,
      type: attendanceType.ATTENDANCE,
      date: today,
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
    const branchId = req.branchId;
    const { startDate, endDate, type, reason } = req.body;

    if (!staffId) throw new ApiError(400, "User Not Logged In");

    const staff = await UserModel.findById(staffId);
    if (!staff) throw new ApiError(404, "Staff not found");

    if (!startDate || !endDate)
      throw new ApiError(400, "Please provide both startDate and endDate");

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end)
      throw new ApiError(400, "startDate cannot be after endDate");

    // Check overlapping leaves
    const overlappingLeave = await LeaveModel.findOne({
      staffId,
      branch: branchId,
      status: { $in: [leaveStatus.PENDING, leaveStatus.APPROVED] },
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (overlappingLeave)
      throw new ApiError(400, "Leave already exists for the given dates");

    // Create leave request
    const leave = await LeaveModel.create({
      staffId,
      branch: branchId,
      startDate: start,
      endDate: end,
      type: type || leaveType.LEAVE_PAID,
      reason: reason || "",
      status: leaveStatus.PENDING,
    });

    // Create attendance entries for each day
    const createdAttendances = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Upsert attendance
      const attendance = await AttendanceModel.findOneAndUpdate(
        {
          staffId,
          branch: branchId,
          type: attendanceType.LEAVE,
          date: { $gte: dayStart, $lte: dayEnd },
        },
        {
          staffId,
          branch: branchId,
          type: attendanceType.LEAVE,
          status: attendanceStatus.PENDING,
          leaveDescription: reason || "",
          date: dayStart,
          workingHour: "FULL_DAY",
        },
        { upsert: true, new: true }
      );

      createdAttendances.push(attendance);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return new ApiResponse({
      statusCode: 201,
      message: "Leave applied successfully",
    }).send(res);
  }
);

export const getMonthlyAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;
    console.log("logging staff id: ", staffId);

    const { month, year } = req.query; // month: 1-12, year: YYYY

    if (!staffId) throw new ApiError(400, "User Not Logged In");
    if (!month || !year)
      throw new ApiError(400, "Please provide month and year");

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

    if (
      attendance.punchOut.status === punchOutStatus.PENDING ||
      attendance.punchOut.status === punchOutStatus.APPROVED
    ) {
      throw new ApiError(400, "Punch-out already applied for today");
    }

    if (attendance.punchIn.isApproved === false) {
      throw new ApiError(400, "Punch-in not approved yet");
    }

    attendance.punchOut = {
      time: new Date(),
      isApproved: false,
      status: punchOutStatus.PENDING,
    };

    await attendance.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Punch-out applied successfully, pending approval",
      data: attendance.punchOut,
    }).send(res);
  }
);

export const getTodayAttendanceStatus = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const record = await AttendanceModel.findOne({
      staffId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).select("type status workingHour punchIn punchOut leaveDescription");

    return new ApiResponse({
      statusCode: 200,
      message: "Today's attendance status fetched successfully",
      data: record || { status: "NOT_APPLIED" },
    }).send(res);
  }
);
