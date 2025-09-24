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
import {
  emitAttendanceRequest,
  emitLeaveRequest,
  emitPunchOutRequest,
  getIO,
} from "../socketio.js";
import StaffModel from "../models/staff.model.js";
import mongoose from "mongoose";



export const applyForAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const branchId = req.branchId;
    const { workingHour } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const now = new Date(); // current UTC timestamp
    const startOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    // check existing attendance
    const existingAttendance = await AttendanceModel.findOne({
      staffId: userId,
      branch: branchId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    if (existingAttendance) {
      if (
        existingAttendance.status !== attendanceStatus.REJECTED_LEAVE &&
        existingAttendance.status !== attendanceStatus.DISMISSED
      ) {
        throw new ApiError(400, "Attendance already applied for today");
      }

      existingAttendance.type = attendanceType.ATTENDANCE;
      existingAttendance.status = attendanceStatus.PENDING;
      existingAttendance.workingHour = workingHour || WorkingHour.FULL_DAY;
      existingAttendance.leaveDescription = "";
      existingAttendance.punchIn = { time: now, isApproved: false };
      existingAttendance.date = now;
      await existingAttendance.save();

      emitAttendanceRequest(existingAttendance);

      return new ApiResponse({
        statusCode: 200,
        message: "Attendance applied successfully",
      }).send(res);
    }

    const attendance = await AttendanceModel.create({
      staffId: userId,
      branch: branchId,
      type: attendanceType.ATTENDANCE,
      date: now,
      workingHour: workingHour || WorkingHour.FULL_DAY,
      leaveDescription: "",
      status: attendanceStatus.PENDING,
      punchIn: { time: now, isApproved: false },
    });

    emitAttendanceRequest(attendance);

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

    if (overlappingLeave?.status == leaveStatus.APPROVED)
      throw new ApiError(400, "Leave already exists for the given dates");

    else if (overlappingLeave?.status == leaveStatus.PENDING)
      throw new ApiError(
        400,
        "You have a pending leave request for the given dates"
      );

    //  Check for conflicting ATTENDANCE entries
    const conflictingAttendance = await AttendanceModel.findOne({
      staffId,
      branch: branchId,
      date: { $gte: start, $lte: end },
    });

    if (conflictingAttendance) {
      const conflictDate = conflictingAttendance.date.toISOString().split("T")[0];
      throw new ApiError(
        400,
        `You have already applied for attendance on ${conflictDate}. Leave request cannot overlap.`
      );
    }

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

    // Create attendance entries for each day in UTC
    const createdAttendances = [];
    let currentDate = new Date(start.getTime());

    while (currentDate <= end) {
      const utcDayStart = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        0, 0, 0, 0
      ));

      const attendance = await AttendanceModel.findOneAndUpdate(
        {
          staffId,
          branch: branchId,
          type: attendanceType.LEAVE,
          date: { $gte: utcDayStart, $lte: new Date(utcDayStart.getTime() + 86399999) },
        },
        {
          staffId,
          branch: branchId,
          type: attendanceType.LEAVE,
          status: attendanceStatus.PENDING,
          leaveDescription: reason || "",
          date: utcDayStart,
          workingHour: "FULL_DAY",
        },
        { upsert: true, new: true }
      );

      createdAttendances.push(attendance);
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

    emitLeaveRequest(leave);

    return new ApiResponse({
      statusCode: 201,
      message: "Leave applied successfully",
    }).send(res);
  }
);


export const getMonthlyAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;
    const { month, year } = req.query;

    if (!staffId) throw new ApiError(400, "User Not Logged In");
    if (!month || !year)
      throw new ApiError(400, "Please provide month and year");

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    const startOfMonthUTC = new Date(
      Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0)
    );
    const endOfMonthUTC = new Date(
      Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)
    );

    const attendance = await AttendanceModel.find({
      staffId,
      date: { $gte: startOfMonthUTC, $lte: endOfMonthUTC },
    })
      .sort({ date: 1 });

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

    const now = new Date();
    const startOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const attendance = await AttendanceModel.findOne({
      staffId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      type: attendanceType.ATTENDANCE,
    });

    if (!attendance) throw new ApiError(404, "No attendance found for today");

    if (
      attendance.punchOut &&
      (attendance.punchOut.status === punchOutStatus.PENDING ||
        attendance.punchOut.status === punchOutStatus.APPROVED)
    ) {
      throw new ApiError(400, "Punch-out already applied for today");
    }

    if (!attendance.punchIn || attendance.punchIn.isApproved === false) {
      throw new ApiError(400, "Punch-in not approved yet");
    }

    attendance.punchOut = {
      time: now,
      isApproved: false,
      status: punchOutStatus.PENDING,

    };

    await attendance.save();

    emitPunchOutRequest(attendance);

    return new ApiResponse({
      statusCode: 200,
      message: "Punch-out applied successfully, pending approval",
    }).send(res);
  }
);

export const getTodayAttendanceStatus = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.userId;

    const now = new Date();
    const startOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const record = await AttendanceModel.findOne({
      staffId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    }).select("type status workingHour punchIn punchOut leaveDescription");

    return new ApiResponse({
      statusCode: 200,
      message: "Today's attendance status fetched successfully",
      data: record,
    }).send(res);
  }
);

export const getStaffList = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffList = await StaffModel.find().populate("userId", "name username role").select("designation");

    return new ApiResponse({
      statusCode: 200,
      message: "All staff members fetched successfully!",
      data: staffList,
    }).send(res);
  }
);

export const getStaffListByManager = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const managerId = req.userId;

    const staffList = await StaffModel.find({
      manager: managerId,
    }).populate("userId", "name username role").select("designation");

    return new ApiResponse({
      statusCode: 200,
      message: "All staff members fetched successfully!",
      data: staffList,
    }).send(res);
  }
);

export const getStaffListByBranch = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const branchId = req.query.branchId as string;

    const staffList = await StaffModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.branch": new mongoose.Types.ObjectId(branchId),
        },
      },
      {
        $project: {
          "user.name": 1,
          "user.username": 1,
          "user.role": 1,
          "user._id": 1,
          "designation": 1,
        }
      }
    ]);


    return new ApiResponse({
      statusCode: 200,
      message: "All staff members fetched successfully!",
      data: staffList,
    }).send(res);
  }
);

export const getStaffDetails = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.query.staffId;
    
    const staffDetails = await StaffModel.findById(staffId).populate("userId", "-password");
    
    return new ApiResponse({
      statusCode: 200,
      message: "Staff details fetched successfully!",
      data: staffDetails,
    }).send(res);
  }
)
