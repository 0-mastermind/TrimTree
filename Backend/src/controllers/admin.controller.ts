import { ApiError } from "../utils/ApiError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import branchModel from "../models/branch.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import StaffModel from "../models/staff.model.js";
import UserModel from "../models/user.model.js";
import { userRoles } from "../utils/constants.js";
import AttendanceModel from "../models/attendance.model.js";
import LeaveModel from "../models/leave.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const createBranch = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, address } = req.body;
    const { branchImage } = req.files as {
      [filedName: string]: Express.Multer.File[];
    };

    if (!name && !address && !branchImage) {
      throw new ApiError(400, "All fields are required");
    }

    const imageUpload = await uploadOnCloudinary(
      branchImage[0].path,
      "Branches"
    );

    if (!imageUpload) {
      throw new ApiError(500, "Error while uploading image");
    }

    const branch = await branchModel.create({
      name,
      address,
      branchImage: {
        publicId: imageUpload.public_id,
        url: imageUpload.secure_url,
      },
    });

    if (!branch) {
      throw new ApiError(500, "Error while storing branch data");
    }

    return new ApiResponse({
      statusCode: 201,
      message: "Branch created successfully!",
    }).send(res);
  }
);

export const getAllBranches = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const branchesList = await branchModel.find();

    return new ApiResponse({
      statusCode: 200,
      message: "Branches fetched successfully!",
      data: branchesList,
    }).send(res);
  }
);


export const deleteStaff = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.query.staffId;
    if (!userId) throw new ApiError(400, "Staff ID is required");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findById(userId).session(session);
      if (!user) throw new ApiError(404, "User not found");
      if (user.role !== userRoles.STAFF) throw new ApiError(400, "User is not a staff member");

      if (user.image && user.image.publicId) {
        await cloudinary.uploader.destroy(user.image.publicId);
      }

      await StaffModel.findOneAndDelete({ userId: user._id }).session(session);
      await AttendanceModel.deleteMany({ userId: userId }).session(session);
      await LeaveModel.deleteMany({ userId: userId }).session(session);
      await UserModel.findByIdAndDelete(userId).session(session);

      await session.commitTransaction();
      session.endSession();

      return new ApiResponse({
        statusCode: 200,
        message: "Staff deleted successfully!",
      }).send(res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
);


export const getBranchManagers = asyncErrorHandler(async (req: Request, res: Response) => {
  const branchId = req.query.branchId;

  let filter: Record<string, any> = { role: userRoles.MANAGER };

  if (branchId) {
    filter.branch = branchId;
    const manager = await UserModel.findOne(filter).populate("branch");
    if (!manager) {
      throw new ApiError(404, "No manager found for the specified branch");
    }
    return new ApiResponse({
      statusCode: 200,
      message: "Branch manager found",
      data: manager
    }).send(res);
  }

  const managers = await UserModel.find(filter).populate("branch");
  return new ApiResponse({
    statusCode: 200,
    message: "All branch managers",
    data: managers
  }).send(res);
});

export const markPaymentOfEmployee = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const staffId = req.query.staffId;
    const {from, to, amount} = req.body;
    
    const updatedStaff = await StaffModel.findByIdAndUpdate(staffId, {
      $push: {
        payments: {
          from: new Date(from),
          to: new Date(to),
          amount
        }
      },
      $set: {
        bonus: [],
      }
    });
    
    if (!updatedStaff) {
      throw new ApiError(500, "Failed to add payment");
    }
    
    return new ApiResponse(
      {
        statusCode: 200,
        message: "Payments updated successfully!",
      }
    ).send(res);
  }
);