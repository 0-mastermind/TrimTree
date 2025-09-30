import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import AttendanceModel from "../models/attendance.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  attendanceType,
  WorkingHour,
  attendanceStatus,
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
import branchModel from "../models/branch.model.js";

export const applyForAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const branchId = req.branchId;
    const { workingHour } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const staff = await StaffModel.findOne({ userId: user._id });
    if (!staff) throw new ApiError(404, "Staff not found");

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
      userId: userId,
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

      const attendanceReq = {
        _id: existingAttendance._id,
        staffId: staff._id,
        date: existingAttendance.date,
        workingHour: existingAttendance.workingHour,
        punchIn: existingAttendance.punchIn,
        userId: {
          _id: user._id,
          name: user.name,
          image: user.image,
        },
      };

      emitAttendanceRequest(attendanceReq, staff.manager.toString());

      return new ApiResponse({
        statusCode: 200,
        message: "Attendance applied successfully",
        data: existingAttendance,
      }).send(res);
    }

    const attendance = await AttendanceModel.create({
      userId: userId,
      branch: branchId,
      type: attendanceType.ATTENDANCE,
      date: now,
      workingHour: workingHour || WorkingHour.FULL_DAY,
      leaveDescription: "",
      status: attendanceStatus.PENDING,
      punchIn: { time: now, isApproved: false },
    });

    const attendanceReq = {
      _id: attendance._id,
      staffId: staff._id,
      date: attendance.date,
      workingHour: attendance.workingHour,
      punchIn: attendance.punchIn,
      userId: {
        _id: user._id,
        name: user.name,
        image: user.image,
      },
    };

    emitAttendanceRequest(attendanceReq, staff.manager.toString());

    return new ApiResponse({
      statusCode: 201,
      message: "Attendance applied successfully",
      data: attendance,
    }).send(res);
  }
);

export const applyForLeave = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const branchId = req.branchId;
    const { startDate, endDate, reason } = req.body;

    if (!userId) throw new ApiError(400, "User Not Logged In");

    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const staffDoc = await StaffModel.findOne({ userId: user._id }).select(
      "_id"
    );
    if (!staffDoc) throw new ApiError(404, "Staff not found");

    if (!startDate || !endDate) {
      throw new ApiError(400, "Please provide both startDate and endDate");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new ApiError(400, "startDate cannot be after endDate");
    }

    // Find any leave in the same range
    const leaveDoc = await LeaveModel.findOne({
      userId,
      branch: branchId,
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    if (leaveDoc?.status === leaveStatus.APPROVED) {
      throw new ApiError(400, "Leave already exists for the given dates");
    } else if (leaveDoc?.status === leaveStatus.PENDING) {
      throw new ApiError(
        400,
        "You have a pending leave request for the given dates"
      );
    }

    // If REJECTED, update instead of creating new
    let leaveDocToProcess: any = null;
    let isUpdate = false;
    if (leaveDoc?.status === leaveStatus.REJECTED) {
      isUpdate = true;
      leaveDocToProcess = leaveDoc;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let leaveDocResult;
      if (isUpdate) {
        leaveDocToProcess.set({
          startDate: start,
          endDate: end,
          reason: reason || "",
          status: leaveStatus.PENDING,
        });
        leaveDocResult = await leaveDocToProcess.save({ session });
      } else {
        [leaveDocResult] = await LeaveModel.create(
          [
            {
              userId,
              branch: branchId,
              startDate: start,
              endDate: end,
              reason: reason || "",
              status: leaveStatus.PENDING,
            },
          ],
          { session }
        );
      }

      // Loop through each date in leave range
      let currentDate = new Date(start.getTime());
      while (currentDate <= end) {
        const utcDayStart = new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );

        // Find any attendance entry for this date
        const attendanceEntry = await AttendanceModel.findOne({
          userId,
          branch: branchId,
          date: {
            $gte: utcDayStart,
            $lte: new Date(utcDayStart.getTime() + 86399999),
          },
        }).session(session);

        if (attendanceEntry) {
          // If status is not dismissed or rejected leave, block leave application
          if (
            attendanceEntry.status !== attendanceStatus.DISMISSED &&
            attendanceEntry.status !== attendanceStatus.REJECTED_LEAVE
          ) {
            throw new ApiError(
              400,
              `Cannot apply for leave: attendance entry with status '${
                attendanceEntry.status
              }' exists for ${utcDayStart.toISOString().split("T")[0]}`
            );
          }
          // Otherwise, update the existing attendance entry
          attendanceEntry.set({
            type: attendanceType.LEAVE,
            status: attendanceStatus.PENDING,
            leaveDescription: reason || "",
            workingHour: WorkingHour.FULL_DAY,
          });
          await attendanceEntry.save({ session });
        } else {
          // No entry: create new
          await AttendanceModel.create(
            [
              {
                userId,
                branch: branchId,
                type: attendanceType.LEAVE,
                status: attendanceStatus.PENDING,
                leaveDescription: reason || "",
                date: utcDayStart,
                workingHour: WorkingHour.FULL_DAY,
              },
            ],
            { session }
          );
        }

        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }

      await session.commitTransaction();
      session.endSession();

      emitLeaveRequest(leaveDocResult, staffDoc.manager.toString());

      return new ApiResponse({
        statusCode: 201,
        message: isUpdate
          ? "Leave request updated successfully"
          : "Leave applied successfully",
      }).send(res);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
);

export const getMonthlyAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.query.staffId;
    const { month, year } = req.query;

    if (!staffId) throw new ApiError(400, "User Not Logged In");
    if (!month || !year)
      throw new ApiError(400, "Please provide month and year");

    const staff = await StaffModel.findById(staffId);
    const userId = staff?.userId;

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    const startOfMonthUTC = new Date(
      Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0, 0)
    );
    const endOfMonthUTC = new Date(
      Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999)
    );

    const attendance = await AttendanceModel.find({
      userId,
      date: { $gte: startOfMonthUTC, $lte: endOfMonthUTC },
    }).sort({ date: 1 });

    return new ApiResponse({
      statusCode: 200,
      message: "Monthly attendance fetched successfully",
      data: attendance,
    }).send(res);
  }
);

export const applyForPunchOut = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

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

    const user = await UserModel.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const staff = await StaffModel.findOne({ userId: userId });
    if (!staff) throw new ApiError(404, "Staff not found");

    const attendance = await AttendanceModel.findOne({
      userId,
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

    const attendanceReq = {
      _id: attendance._id,
      staffId: staff._id,
      date: attendance.date,
      workingHour: attendance.workingHour,
      punchIn: attendance.punchIn,
      userId: {
        _id: user._id,
        name: user.name,
        image: user.image,
      },
    };

    emitPunchOutRequest(attendanceReq, staff.manager.toString());

    return new ApiResponse({
      statusCode: 200,
      message: "Punch-out applied successfully, pending approval",
      data: attendance,
    }).send(res);
  }
);

export const getTodayAttendanceStatus = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

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
      userId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    return new ApiResponse({
      statusCode: 200,
      message: "Today's attendance status fetched successfully",
      data: record,
    }).send(res);
  }
);

export const getStaffList = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffList = await StaffModel.find()
      .populate({
        path: "userId",
        select: "name username role branch image",
        populate: {
          path: "branch",
          select: "name",
        },
      })
      .select("designation");

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

    const staffList = await StaffModel.find({ manager: managerId })
      .populate({
        path: "userId",
        select: "name username role branch image",
        populate: {
          path: "branch",
          select: "name",
        },
      })
      .select("designation");

    return new ApiResponse({
      statusCode: 200,
      message: "All staff members fetched successfully!",
      data: staffList,
    }).send(res);
  }
);

export const getStaffListByBranch = asyncErrorHandler(async (req, res) => {
  const branchId = req.query.branchId as string;

  if (!branchId) throw new ApiError(400, "Branch ID is required");

  const branchDoc = await branchModel.findById(branchId, { name: 1 });
  if (!branchDoc) {
    return new ApiResponse({
      statusCode: 404,
      message: "Branch not found",
    }).send(res);
  }

  const staffList = await StaffModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },
    { $unwind: "$userId" },
    {
      $match: {
        "userId.branch": new mongoose.Types.ObjectId(branchId),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "userId.branch",
        foreignField: "_id",
        as: "branchData",
      },
    },
    { $unwind: "$branchData" },
    {
      $project: {
        _id: 1,
        designation: 1,
        userId: {
          _id: "$userId._id",
          name: "$userId.name",
          username: "$userId.username",
          image: "$userId.image",
          role: "$userId.role",
          branch: {
            name: "$branchData.name",
          },
        },
      },
    },
  ]);

  return new ApiResponse({
    statusCode: 200,
    message: "All staff members fetched successfully!",
    data: staffList,
  }).send(res);
});

export const getStaffDetails = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.query.staffId;

    const staffDetails = await StaffModel.findById(staffId).populate(
      "userId",
      "-password"
    );

    return new ApiResponse({
      statusCode: 200,
      message: "Staff details fetched successfully!",
      data: staffDetails,
    }).send(res);
  }
);

export const getLeaveHistory = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) throw new ApiError(400, "User Not Logged In");

    const leaveHistory = await LeaveModel.find({ userId }).sort({
      createdAt: -1,
    });
    return new ApiResponse({
      statusCode: 200,
      message: "Leave history fetched successfully",
      data: leaveHistory,
    }).send(res);
  }
);

export const getSpecificEmployeeAnalytics = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.query.staffId as string; // staffId
    const userId = req.query.userId as string; // userId
    // const days = parseInt(req.query.day as string); // days
    const startingDate = req.query.startingDate as string;

    if (!employeeId || !userId) {
      throw new ApiError(400, "Provide staff Id");
    }

    // Calculating analytics
    const attendanceOperations = await AttendanceModel.aggregate([
      {
        // matching with corresponding user id
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(startingDate),
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPresent: {
            $sum: { $cond: [{ $eq: ["$status", "PRESENT"] }, 1, 0] }, // if found increment by one
          },
          totalHalfDayPresent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "PRESENT"] },
                    { $eq: ["$workingHour", "HALF_DAY"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalFullDayPresent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "PRESENT"] },
                    { $eq: ["$workingHour", "FULL_DAY"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ["$status", "ABSENT"] }, 1, 0] },
          },
          totalPaidHoliday: {
            $sum: {
              $cond: [{ $eq: ["$status", "HOLIDAY"] }, 1, 0],
            },
          },
          totalWorkingHoliday: {
            $sum: {
              $cond: [{ $eq: ["$status", "WORKING HOLIDAY"] }, 1, 0],
            },
          },
          totalLeave: {
            $sum: { $cond: [{ $eq: ["$status", "LEAVE"] }, 1, 0] },
          },
          totalDays: {
            $sum: {
              $cond: [
                {
                  $not: {
                    $in: [
                      "$status",
                      ["PENDING", "DISMISSED", "REJECTED_LEAVE"],
                    ],
                  },
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalPresent: 1,
          totalHalfDayPresent: 1,
          totalFullDayPresent: 1,
          totalAbsent: 1,
          totalPaidHoliday: 1,
          totalLeave: 1,
          totalWorkingHoliday: 1,
          totalDays: 1,
        },
      },
    ]);

    // Fetching staff data
    const staffMember = await StaffModel.findById(employeeId);

    const totalBonus =
      staffMember?.bonus.reduce((sum, item) => sum + Number(item.amount), 0) ||
      0;

    const salary = staffMember?.salary! / 30; // daywise salary

    // gross salary
    const grossSalary = salary * attendanceOperations[0]?.totalDays || 0;

    // half day salary
    const halfDayPresentSalary =
      salary * 0.5 * attendanceOperations[0]?.totalHalfDayPresent || 0;

    // full day salary
    const fullDaySalary =
      salary * attendanceOperations[0]?.totalFullDayPresent || 0;

    // total paid holidays
    const paidHolidaySalary =
      salary * attendanceOperations[0]?.totalPaidHoliday || 0;

    // working holiday salary
    const totalWorkingHolidaySalary =
      salary * attendanceOperations[0]?.totalWorkingHoliday || 0;

    // bonus salary
    const totalSalary =
      halfDayPresentSalary +
      fullDaySalary +
      paidHolidaySalary +
      totalWorkingHolidaySalary +
      totalBonus;

    // salary analytics response
    const salaryAnalytics = {
      grossSalary: Number(grossSalary.toFixed(2)),
      halfDayPresentSalary: Number(halfDayPresentSalary.toFixed(2)),
      fullDaySalary: Number(fullDaySalary.toFixed(2)),
      paidHolidaySalary: Number(paidHolidaySalary.toFixed(2)),
      totalWorkingHolidaySalary: Number(totalWorkingHolidaySalary.toFixed(2)),
      totalSalary: Number(totalSalary.toFixed(2)),
      totalBonus: Number(totalBonus.toFixed(2)),
    };

    // attendance analytics response
    const attendanceAnalytics = {
      totalPresent: attendanceOperations[0]?.totalPresent || 0,
      totalHalfDayPresent: attendanceOperations[0]?.totalHalfDayPresent || 0,
      totalFullDayPresent: attendanceOperations[0]?.totalFullDayPresent || 0,
      totalAbsent: attendanceOperations[0]?.totalAbsent || 0,
      totalPaidHoliday: attendanceOperations[0]?.totalPaidHoliday || 0,
      totalWorkingHoliday: attendanceOperations[0]?.totalWorkingHoliday || 0,
      totalLeave: attendanceOperations[0]?.totalLeave || 0,
      totalDays: attendanceOperations[0]?.totalDays || 0,
    };

    return new ApiResponse({
      statusCode: 200,
      message: "Analytics Fetched Successfully!",
      data: {
        attendance: attendanceAnalytics,
        salary: salaryAnalytics,
      },
    }).send(res);
  }
);

export const getSpecificEmployeesDetails = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.query.staffId;

    if (!staffId) {
      throw new ApiError(400, "Staff Id is required");
    }

    const staffMember = await StaffModel.findById(staffId)
      .populate("userId", "-password")
      .select("designation salary manager payments bonus");

    if (!staffMember) {
      throw new ApiError(500, "Failed to fetch employee");
    }

    return new ApiResponse({
      statusCode: 200,
      message: "Employee details fetched successfully!",
      data: staffMember,
    }).send(res);
  }
);
