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
import OfficalHolidayModel from "../models/officialHoliday.model.js";

export const createOfficialHoliday = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, date, description } = req.body;

    if (!name || !date || !description) {
      throw new ApiError(400, "All fields are required");
    }

    const holidayDate = new Date(date);

    const startOfDay = new Date(holidayDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(holidayDate);
    endOfDay.setHours(23, 59, 59, 999);

    const branchId = req.branchId;

    const existingHoliday = await OfficialHolidayModel.findOne({
      branch: branchId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingHoliday) {
      throw new ApiError(
        400,
        "Holiday already exists for this branch on this date"
      );
    } 

    holidayDate.setHours(0, 0, 0, 0);

    await OfficialHolidayModel.create({
      name,
      date: holidayDate,
      branch: branchId,
      description,
    });

    await AttendanceModel.updateMany(
      {
        branch: branchId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: attendanceStatus.PRESENT,
      },
      {
        $set: {
          status: attendanceStatus.WORKING_HOLIDAY,
          type: attendanceType.ATTENDANCE,
        },
      }
    );

    await AttendanceModel.updateMany(
      {
        branch: branchId,
        date: { $gte: startOfDay, $lte: endOfDay },
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
  const startOfDay = new Date(attDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(attDate);
  endOfDay.setHours(23, 59, 59, 999);

  const holiday = await OfficalHolidayModel.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  if (holiday) {
    attendance.status = attendanceStatus.WORKING_HOLIDAY;
  } else {
    attendance.status = attendanceStatus.PRESENT;
  }

  if (attendance.punchIn) attendance.punchIn.isApproved = true;

  await attendance.save();

  return new ApiResponse({
    statusCode: 200,
    message: holiday
      ? "Attendance approved as working holiday"
      : "Attendance approved",
  }).send(res);
});


export const dismissAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { attendanceId } = req.body;

    if (!attendanceId) throw new ApiError(400, "attendanceId is required");

    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) throw new ApiError(404, "Attendance not found");

    attendance.status = attendanceStatus.DISMISSED;
    await attendance.save();

    return new ApiResponse({
      statusCode: 200,
      message: "Attendance dismissed successfully",
      data: attendance,
    }).send(res);
  }
);



export const rejectAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
  const { attendanceId } = req.body;

  const attendance = await AttendanceModel.findById(attendanceId);
  if (!attendance) throw new ApiError(404, "Attendance not found");

  if (attendance.type !== attendanceType.ATTENDANCE) {
    throw new ApiError(400, "Only attendance entries can be rejected");
  }

  if(attendance.status == attendanceStatus.ABSENT)
  {
    throw new ApiError(400, "Attendance is already marked as absent"); 
  }

  if (attendance.status !== attendanceStatus.PENDING) {
    throw new ApiError(400, "Only pending attendance can be rejected");
  }

  attendance.status = attendanceStatus.ABSENT;

  await attendance.save();

  return new ApiResponse({
    statusCode: 200,
    message: "Attendance rejected",
  }).send(res);
});

export const approveLeaves = asyncErrorHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.body;

  if (!leaveId) throw new ApiError(400, "leaveId is required");

  const leave = await LeaveModel.findById(leaveId);
  if (!leave) throw new ApiError(404, "Leave request not found");

  // Determine attendance status
  const attendanceUpdateStatus =
    leave.type === leaveType.LEAVE_PAID ? attendanceStatus.LEAVE_PAID : attendanceStatus.LEAVE_UNPAID;

  // Normalize leave dates
  const startOfDay = new Date(leave.startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(leave.endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Update all attendance entries in leave range
  await AttendanceModel.updateMany(
    {
      staffId: leave.staffId,
      branch: leave.branch,
      type: attendanceType.LEAVE,
      date: { $gte: startOfDay, $lte: endOfDay },
    },
    {
      $set: {
        status: attendanceUpdateStatus,
        leaveDescription: leave.reason,
      },
    }
  );

  // Update leave status
  leave.status = leaveStatus.APPROVED;
  await leave.save();

  return new ApiResponse({
    statusCode: 200,
    message: "Leave approved successfully",
    data: leave,
  }).send(res);
});


export const rejectLeaves = asyncErrorHandler(async (req: Request, res: Response) => {
  const { leaveId } = req.body; 

  if (!leaveId) {
    throw new ApiError(400, "leaveId is required");
  }

  // Fetch leave
  const leave = await LeaveModel.findById(leaveId);
  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }

  // Normalize leave dates
  const startOfDay = new Date(leave.startDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(leave.endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Update all attendance entries in leave range
  await AttendanceModel.updateMany(
    {
      staffId: leave.staffId,
      branch: leave.branch,
      type: attendanceType.LEAVE,
      date: { $gte: startOfDay, $lte: endOfDay },
    },
    {
      $set: {
        status: attendanceStatus.REJECTED_LEAVE,
        leaveDescription: "",
      },
    }
  );

  // Update leave status
  leave.status = leaveStatus.REJECTED;
  await leave.save();

  return new ApiResponse({
    statusCode: 200,
    message: "Leave rejected successfully",
    data: leave,
  }).send(res);
});


export const getAllPendingAttendance = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const branchId = req.branchId;
    const pendingAttendance = await AttendanceModel.find({
      status: attendanceStatus.PENDING,
      type: attendanceType.ATTENDANCE,
      branch: branchId
    }).sort({ date: -1 });

    return new ApiResponse({
      statusCode: 200,
      message: "Pending attendance fetched successfully",
      data: pendingAttendance,
    }).send(res);
  }
);


export const getAllPendingLeaves = asyncErrorHandler(async (req, res) => {
  const branchId = req.branchId;
  if (!branchId) throw new ApiError(400, "Branch ID is required");

  // Find all pending leaves for the branch
  const pendingLeaves = await LeaveModel.find({
    branch: branchId,
    status: "PENDING", // leaveStatus.PENDING if using constants
  })
    .populate({
      path: "staffId",
      select: "name username",
      model: UserModel,
    })
    .sort({ startDate: -1 });

  return new ApiResponse({
    statusCode: 200,
    message: "Pending leaves fetched successfully",
    data: pendingLeaves,
  }).send(res);
});




export const getMonthlyOfficialHolidays = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const branchId = req.branchId;
    const { month, year } = req.query; // month: 1-12, year: YYYY

    if (!month || !year) throw new ApiError(400, "Please provide month and year");

    const monthNum = parseInt(month as string);
    const yearNum = parseInt(year as string);

    // Start of month
    const startOfMonth = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    // End of month
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const officialHolidays = await OfficialHolidayModel.find({
      branch : branchId,
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
    const { attendanceId } = req.body;

    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) throw new ApiError(404, "Attendance not found");
    if (!attendance.punchOut?.time) {
      throw new ApiError(400, "Punch-out not applied yet");
    }
    if (attendance.punchOut.isApproved) {
      throw new ApiError(400, "Punch-out already approved");
    }

    attendance.punchOut.isApproved = true;
    attendance.punchOut.status = punchOutStatus.APPROVED;
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
    const { attendanceId } = req.body;

    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) throw new ApiError(404, "Attendance not found");
    if (!attendance.punchOut?.time) {
      throw new ApiError(400, "Punch-out not applied yet");
    }
    if (attendance.punchOut.isApproved) {
      throw new ApiError(400, "Punch-out already approved, cannot reject");
    }

    attendance.punchOut = {
      time: attendance.punchOut.time,
      isApproved: false,
      status: punchOutStatus.REJECTED,
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
  }
);
