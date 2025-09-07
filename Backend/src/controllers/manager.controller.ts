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
    const { name, date, type, description } = req.body;

    if (!name || !date || !description ) {
      throw new ApiError(400, "All fields are required");
    }

    const holidayDate = new Date(date);
    const startOfDay = new Date(holidayDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(holidayDate.setHours(23, 59, 59, 999));

    const branch = req.branch

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

export const getAllPendingAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const pendingAttendance = await AttendanceModel.find({
      status: attendanceStatus.PENDING,
      type: attendanceType.ATTENDANCE,
    }).sort({ date: -1 });

    return new ApiResponse({
      statusCode: 200,
      message: "Pending attendance fetched successfully",
      data: pendingAttendance,
    }).send(res);
  }
);

export const getAllPendingLeaves = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const groupedLeaves = await AttendanceModel.aggregate([
      {
        $match: {
          status: attendanceStatus.PENDING,
          type: attendanceType.LEAVE,
        },
      },
      {
        $group: {
          _id: "$staffId",
          leaves: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "staffs", 
          localField: "_id",
          foreignField: "_id",
          as: "staff",
        },
      },
      {
        $unwind: "$staff",
      },
      {
        $project: {
          _id: 0,
          staffId: "$_id",
          staffName: "$staff.name",
          leaves: 1,
          count: 1,
        },
      },
      {
        $sort: { staffName: 1 },
      },
    ]);

    return new ApiResponse({
      statusCode: 200,
      message: "Pending leaves grouped by staff fetched successfully",
      data: groupedLeaves,
    }).send(res);
  }
);

export const getMonthlyOfficialHolidays = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const branch = req.branch;
    const { month, year } = req.query; // month: 1-12, year: YYYY

    if (!branch) throw new ApiError(400, "Branch is required");
    if (!month || !year) throw new ApiError(400, "Please provide month and year");

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    // Start of month
    const startOfMonth = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    // End of month
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const officialHolidays = await OfficialHolidayModel.find({
      branch,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 }); // ascending by date

    return new ApiResponse({
      statusCode: 200,
      message: "Monthly official holidays fetched successfully",
      data: officialHolidays,
    }).send(res);
  }
);

export const approvePunchOut = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { attendanceId } = req.params;

    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) throw new ApiError(404, "Attendance not found");
    if (!attendance.punchOut?.time) {
      throw new ApiError(400, "Punch-out not applied yet");
    }
    if (attendance.punchOut.isApproved) {
      throw new ApiError(400, "Punch-out already approved");
    }

    attendance.punchOut.isApproved = true;
    await attendance.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Punch-out approved successfully",
      data: attendance.punchOut,
    }).send(res);
  }
);

export const rejectPunchOut = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { attendanceId } = req.params;

    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) throw new ApiError(404, "Attendance not found");
    if (!attendance.punchOut?.time) {
      throw new ApiError(400, "Punch-out not applied yet");
    }
    if (attendance.punchOut.isApproved) {
      throw new ApiError(400, "Punch-out already approved, cannot reject");
    }

    // Reset punchOut since manager rejected it
    attendance.punchOut = {
      time: new Date(new Date().setHours(3, 0, 0, 0)), // 3:00 AM today,
      isApproved: false,
    };
    await attendance.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Punch-out rejected successfully",
    }).send(res);
  }
);


export const getAllPendingPunchOuts = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const pendingPunchOuts = await AttendanceModel.find({
      "punchOut.isApproved": false,     
      type: attendanceType.ATTENDANCE,
    })
      .sort({ date: -1 })
      .populate("staffId", "name") 
      .select("date punchOut staffId");

    return new ApiResponse({
      statusCode: 200,
      message: "Pending punch-outs fetched successfully",
      data: pendingPunchOuts,
    }).send(res);
  }
);
