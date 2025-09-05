import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import OfficialHolidayModel from "../models/officialHoliday.model.js";
import AttendanceModel from "../models/attendance.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  attendanceStatus,
  attendanceType,
  WorkingHour,
} from "../utils/constants.js";

export const createOfficialHoliday = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, date, type, description, branch } = req.body;

    if (!name || !date || !description || !branch) {
      throw new ApiError(400, "All fields are required");
    }

    const holidayDate = new Date(date);
    const startOfDay = new Date(holidayDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(holidayDate.setHours(23, 59, 59, 999));

    // Check if holiday already exists for the branch on this date
    const existingHoliday = await OfficialHolidayModel.findOne({
      branch,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingHoliday) {
      throw new ApiError(
        400,
        "Holiday already exists for this branch on this date"
      );
    }

    // Create the official holiday
    const holiday = await OfficialHolidayModel.create({
      name,
      date: holidayDate,
      type: type || WorkingHour.FULL_DAY,
      description,
      branch,
    });

    // Update staff attendance if any entry exists for this date
    await AttendanceModel.updateMany(
      {
        date: { $gte: startOfDay, $lte: endOfDay },
        status: {
          $in: [
            attendanceStatus.PENDING,
            attendanceStatus.LEAVE_PAID,
            attendanceStatus.LEAVE_UNPAID,
          ],
        },
      },
      {
        $set: {
          status: attendanceStatus.HOLIDAY,
          type: attendanceType.ATTENDANCE,
        },
      }
    );

    return new ApiResponse({
      statusCode: 201,
      message:
        "Official holiday created successfully and staff attendance updated",
    }).send(res);
  }
);


export const approveAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");

  attendance.status = attendanceStatus.PRESENT;
  if (attendance.punchIn) attendance.punchIn.isApproved = true;

  await attendance.save();

  return new ApiResponse({
    statusCode: 200,
    message: "Attendance approved",
  }).send(res);
});


export const rejectAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.params;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");

  attendance.status = attendanceStatus.ABSENT;

  await attendance.save();

  return new ApiResponse({
    statusCode: 200,
    message: "Attendance rejected",
  }).send(res);
});

export const approveLeaves = asyncErrorHandler(async (req: Request, res: Response) => {
  const { leaveIds, isPaid } = req.body; // expect an array of leave _id's

  if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
    throw new ApiError(400, "No leave IDs provided");
  }

  const newStatus = isPaid ? attendanceStatus.LEAVE_PAID : attendanceStatus.LEAVE_UNPAID;

  // Update all selected leaves
  await AttendanceModel.updateMany(
    { _id: { $in: leaveIds }, type: attendanceType.LEAVE },
    { $set: { status: newStatus } }
  );

  return new ApiResponse({
    statusCode: 200,
    message: `Leaves ${isPaid ? "approved as paid" : "approved as unpaid"} successfully`,
  }).send(res);
});


export const rejectLeaves = asyncErrorHandler(async (req: Request, res: Response) => {
  const { leaveIds } = req.body; // expect an array of leave _id's

  if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
    throw new ApiError(400, "No leave IDs provided");
  }

  // Update all selected leaves
  await AttendanceModel.updateMany(
    { _id: { $in: leaveIds }, type: attendanceType.LEAVE },
    { $set: { status: attendanceStatus.REJECTED_LEAVE } }
  );

  return new ApiResponse({
    statusCode: 200,
    message: "Leaves rejected successfully",
  }).send(res);
});

