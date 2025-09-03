import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import UserModel from "../models/user.model.js";
import StaffModel from "../models/staff.model.js";
import { userRoles } from "../utils/constants.js";

export const registerUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { name, username, password, role } = req.body;

    if (![userRoles.ADMIN, userRoles.MANAGER].includes(req.role as any)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and role are required",
      });
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this username already exists",
      });
    }

    await UserModel.create({
      name,
      username,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  }
);

export const loginUser = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  }
);

export const logout = asyncErrorHandler(
  async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  }
);

export const getUserProfile = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let staffData = null;

    if (user.role === "STAFF") {
      staffData = await StaffModel.findOne({ user: userId });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        staffData,
      },
    });
  }
);



