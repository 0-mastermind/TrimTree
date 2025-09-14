import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import OfficialHolidayModel from "../models/officialHoliday.model.js";
import AttendanceModel from "../models/attendance.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  attendanceStatus,
  attendanceType,
  leaveStatus,
  leaveType,
  punchOutStatus,
} from "../utils/constants.js";
import UserModel from "../models/user.model.js";
import LeaveModel from "../models/leave.model.js";
import { emitAttendanceUpdated, emitLeaveUpdated, emitPunchOutUpdated } from "../socketio.js";
import mongoose from "mongoose";

const getUTCStartOfDay = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));

const getUTCEndOfDay = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

export const createOfficialHoliday = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, date, description } = req.body;
      const branchId = req.branchId;

      const holidayDate = new Date(date);
      const startOfDayUTC = getUTCStartOfDay(holidayDate);
      const endOfDayUTC = getUTCEndOfDay(holidayDate);

      const existingHoliday = await OfficialHolidayModel.findOne({
        branch: branchId,
        date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      }).session(session);

      if (existingHoliday) {
        throw new ApiError(400, "Holiday already exists for this branch on this date");
      }

      await OfficialHolidayModel.create(
        [{ name, date: startOfDayUTC, branch: branchId, description }],
        { session }
      );

      await AttendanceModel.updateMany(
        {
          branch: branchId,
          date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
          status: attendanceStatus.PRESENT,
        },
        { $set: { status: attendanceStatus.WORKING_HOLIDAY, type: attendanceType.ATTENDANCE } },
        { session }
      );

      await AttendanceModel.updateMany(
        {
          branch: branchId,
          date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
          status: {
            $in: [
              attendanceStatus.PENDING,
              attendanceStatus.LEAVE_PAID,
              attendanceStatus.LEAVE_UNPAID,
              attendanceStatus.ABSENT,
              attendanceStatus.REJECTED_LEAVE,
              attendanceStatus.DISMISSED,
            ],
          },
        },
        { $set: { status: attendanceStatus.HOLIDAY, type: attendanceType.ATTENDANCE , leaveDescription: "" } },
        { session }
      );

      const updatedAttendances = await AttendanceModel.find({
        branch: branchId,
        date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      }).session(session);

      await session.commitTransaction();
      session.endSession();

      updatedAttendances.forEach((attendance) => emitAttendanceUpdated(attendance));

      return new ApiResponse({
        statusCode: 201,
        message: "Official holiday created successfully and staff attendance updated",
      }).send(res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
);

export const approveAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.body;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");

  if (attendance.type !== attendanceType.ATTENDANCE) {
    throw new ApiError(400, "Only attendance entries can be approved");
  }

  if (attendance.status === attendanceStatus.PRESENT) {
    throw new ApiError(400, "Attendance is already marked as present");
  }

  if (attendance.status !== attendanceStatus.PENDING) {
    throw new ApiError(400, "Only pending attendance can be approved");
  }

  const attDate = new Date(attendance.date);
  const startOfDayUTC = getUTCStartOfDay(attDate);
  const endOfDayUTC = getUTCEndOfDay(attDate);

  const holiday = await OfficialHolidayModel.findOne({
    branch: attendance.branch,
    date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
  });

  attendance.status = holiday ? attendanceStatus.WORKING_HOLIDAY : attendanceStatus.PRESENT;

  if (attendance.punchIn) attendance.punchIn.isApproved = true;

  await attendance.save();

  emitAttendanceUpdated(attendance);

  return new ApiResponse({
    statusCode: 200,
    message: holiday ? "Attendance approved as working holiday" : "Attendance approved",
  }).send(res);
});

export const dismissAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.body;
  if (!attendanceId) throw new ApiError(400, "attendanceId is required");

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");

  attendance.status = attendanceStatus.DISMISSED;
  await attendance.save();

  emitAttendanceUpdated(attendance);

  return new ApiResponse({
    statusCode: 200,
    message: "Attendance dismissed successfully",
  }).send(res);
});

export const rejectAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.body;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");

  if (attendance.type !== attendanceType.ATTENDANCE) {
    throw new ApiError(400, "Only attendance entries can be rejected");
  }

  if (attendance.status === attendanceStatus.ABSENT) {
    throw new ApiError(400, "Attendance is already marked as absent");
  }

  if (attendance.status !== attendanceStatus.PENDING) {
    throw new ApiError(400, "Only pending attendance can be rejected");
  }

  attendance.status = attendanceStatus.ABSENT;
  await attendance.save();

  emitAttendanceUpdated(attendance);

  return new ApiResponse({
    statusCode: 200,
    message: "Attendance rejected",
  }).send(res);
});

export const approveLeaves = asyncErrorHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.body;
  if (!leaveId) throw new ApiError(400, "leaveId is required");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const leave = await LeaveModel.findById(leaveId).session(session);
    if (!leave) throw new ApiError(404, "Leave request not found");

    const attendanceUpdateStatus =
      leave.type === leaveType.LEAVE_PAID
        ? attendanceStatus.LEAVE_PAID
        : attendanceStatus.LEAVE_UNPAID;

    const startOfDayUTC = getUTCStartOfDay(new Date(leave.startDate));
    const endOfDayUTC = getUTCEndOfDay(new Date(leave.endDate));

    const updatedAttendances = await AttendanceModel.find({
      staffId: leave.staffId,
      branch: leave.branch,
      type: attendanceType.LEAVE,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    }).session(session);

    await AttendanceModel.updateMany(
      {
        staffId: leave.staffId,
        branch: leave.branch,
        type: attendanceType.LEAVE,
        date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      },
      { $set: { status: attendanceUpdateStatus, leaveDescription: leave.reason } },
      { session }
    );

    leave.status = leaveStatus.APPROVED;
    await leave.save({ session });

    await session.commitTransaction();
    session.endSession();

    updatedAttendances.forEach((attendance) => emitAttendanceUpdated(attendance));
    emitLeaveUpdated(leave);

    return new ApiResponse({
      statusCode: 200,
      message: "Leave approved successfully",
    }).send(res);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const rejectLeaves = asyncErrorHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.body;
  if (!leaveId) throw new ApiError(400, "leaveId is required");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const leave = await LeaveModel.findById(leaveId).session(session);
    if (!leave) throw new ApiError(404, "Leave request not found");

    const startOfDayUTC = getUTCStartOfDay(new Date(leave.startDate));
    const endOfDayUTC = getUTCEndOfDay(new Date(leave.endDate));

    const updatedAttendances = await AttendanceModel.find({
      staffId: leave.staffId,
      branch: leave.branch,
      type: attendanceType.LEAVE,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    }).session(session);

    await AttendanceModel.updateMany(
      {
        staffId: leave.staffId,
        branch: leave.branch,
        type: attendanceType.LEAVE,
        date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      },
      { $set: { status: attendanceStatus.REJECTED_LEAVE, leaveDescription: "" } },
      { session }
    );

    leave.status = leaveStatus.REJECTED;
    await leave.save({ session });

    await session.commitTransaction();
    session.endSession();

    updatedAttendances.forEach((attendance) => emitAttendanceUpdated(attendance));
    emitLeaveUpdated(leave);

    return new ApiResponse({
      statusCode: 200,
      message: "Leave rejected successfully",
    }).send(res);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export const getAllPendingAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const branchId = req.branchId;
  const pendingAttendance = await AttendanceModel.find({
    status: attendanceStatus.PENDING,
    type: attendanceType.ATTENDANCE,
    branch: branchId,
  }).sort({ date: -1 });

  return new ApiResponse({
    statusCode: 200,
    message: "Pending attendance fetched successfully",
    data: pendingAttendance,
  }).send(res);
});

export const getAllPendingLeaves = asyncErrorHandler(async (req, res) => {
  const branchId = req.branchId;
  if (!branchId) throw new ApiError(400, "Branch ID is required");

  const pendingLeaves = await LeaveModel.find({
    branch: branchId,
    status: leaveStatus.PENDING,
  })
    .populate({ path: "staffId", select: "name username", model: UserModel })
    .sort({ startDate: -1 });

  return new ApiResponse({
    statusCode: 200,
    message: "Pending leaves fetched successfully",
    data: pendingLeaves,
  }).send(res);
});

export const getMonthlyOfficialHolidays = asyncErrorHandler(async (req: Request, res: Response) => {
  const branchId = req.branchId;
  const { month, year } = req.query;

  if (!month || !year) throw new ApiError(400, "Please provide month and year");

  const monthNum = parseInt(month as string);
  const yearNum = parseInt(year as string);

  const startOfMonthUTC = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0));
  const endOfMonthUTC = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999));

  const officialHolidays = await OfficialHolidayModel.find({
    branch: branchId,
    date: { $gte: startOfMonthUTC, $lte: endOfMonthUTC },
  }).sort({ date: 1 });

  return new ApiResponse({
    statusCode: 200,
    message: "Monthly official holidays fetched successfully",
    data: officialHolidays,
  }).send(res);
});

export const approvePunchOut = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.body;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");
  if (!attendance.punchOut?.time) throw new ApiError(400, "Punch-out not applied yet");
  if (attendance.punchOut.isApproved) throw new ApiError(400, "Punch-out already approved");

  attendance.punchOut.isApproved = true;
  attendance.punchOut.status = punchOutStatus.APPROVED;
  await attendance.save();

  emitPunchOutUpdated(attendance);

  return new ApiResponse({
    statusCode: 200,
    message: "Punch-out approved successfully",
  }).send(res);
});

export const rejectPunchOut = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.body;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");
  if (!attendance.punchOut?.time) throw new ApiError(400, "Punch-out not applied yet");
  if (attendance.punchOut.isApproved)
    throw new ApiError(400, "Punch-out already approved, cannot reject");

  attendance.punchOut = {
    time: attendance.punchOut.time,
    isApproved: false,
    status: punchOutStatus.REJECTED,
  };
  await attendance.save();

  emitPunchOutUpdated(attendance);

  return new ApiResponse({
    statusCode: 200,
    message: "Punch-out rejected successfully",
  }).send(res);
});

export const getAllPendingPunchOuts = asyncErrorHandler(async (req: Request, res: Response) => {
  const pendingPunchOuts = await AttendanceModel.find({
    branch: req.branchId,
    "punchOut.isApproved": false,
    "punchOut.status": punchOutStatus.PENDING,
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
});
