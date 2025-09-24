import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import UserModel from "../models/user.model.js";
import StaffModel from "../models/staff.model.js";
import { userRoles } from "../utils/constants.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      username,
      password,
      role,
      salary,
      designation,
      manager,
      branch,
    } = req.body;

    if (!username || !password || !role || !branch) {
      throw new ApiError(400, "Fill All the Required Fields");
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new ApiError(409, "User with this username already exists");
    }

    const user = await UserModel.create({
      name,
      username,
      password,
      role,
      branch,
    });

    if (role === userRoles.STAFF) {
      if (!salary || !designation || !manager) {
        throw new ApiError(
          400,
          "Salary, designation, and manager are required for staff"
        );
      }

      await StaffModel.create({
        userId: user._id,
        salary,
        designation,
        manager,
      });
    }

    return new ApiResponse({
      statusCode: 201,
      message: "User registered successfully",
    }).send(res);
  }
);

export const loginStaff = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    const user = await UserModel.findOne({ username });
    if (!user) throw new ApiError(404, "User not found");

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    // Check role
    if (user.role !== userRoles.STAFF) {
      throw new ApiError(403, "Access denied");
    }

    const token = user.generateJWT();

    // set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
    });

    return new ApiResponse({
      statusCode: 200,
      message: "Logged In",
      data: user,
    }).send(res);
  }
);

export const loginAdminManager = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    if (user.role !== userRoles.ADMIN && user.role !== userRoles.MANAGER) {
      throw new ApiError(403, "Access Denied");
    }

    const token = user.generateJWT();
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 6 * 60 * 60 * 1000, // 6 hours
      });

    return new ApiResponse({
      statusCode: 200,
      message: "Logged In",
      data : user,
    }).send(res);
  }
);

export const logout = asyncErrorHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new ApiResponse({
    statusCode: 200,
    message: "Logged out successfully",
  }).send(res);
});

export const getUserProfile = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return new ApiError(401, "Unauthorized");
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let staffData = null;

    if (user.role === userRoles.STAFF) {
      staffData = await StaffModel.findOne({ user: userId });
    }

    return new ApiResponse({
      statusCode: 200,
      data: { user, staffData },
      message: "Profile fetched successfully",
    }).send(res);
  }
);
