import type { Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import UserModel from "../models/user.model.js";
import StaffModel from "../models/staff.model.js";
import { userRoles } from "../utils/constants.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

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
      throw new ApiError(400, "Fill all the required fields");
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new ApiError(409, "User with this username already exists");
    }

    let imageData = undefined;
    if (req.file) {
      const localPath = req.file.path;
      const uploaded = await uploadOnCloudinary(localPath, `profileImage/${username}`);

      if (!uploaded) {
        fs.unlinkSync(localPath);
        throw new ApiError(500, "Image upload failed");
      }

      imageData = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      };

      fs.unlinkSync(localPath);
    }

    const user = await UserModel.create({
      name,
      username,
      password,
      role,
      branch,
      image: imageData,
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
      statusCode: 200,
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

export const updateStaff = asyncErrorHandler(async (req: Request, res: Response) => {
  const {
    userId,
    name,
    username,
    email,
    password,
    branch,
    designation,
    manager,
    salary,
  } = req.body;



  const staff = await StaffModel.findOne({ userId }).populate("userId");
  if (!staff) {
    throw new ApiError(404, "Staff not found");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (name && name !== user.name) user.name = name;
  if (username && username !== user.username) user.username = username;
  if (email && email !== user.email) user.email = email;
  if (branch && branch !== user.branch?.toString()) user.branch = branch;
  if (password) user.password = password;

  if (req.file) {
    if (user.image?.publicId) {
      await cloudinary.uploader.destroy(user.image.publicId);
    }
    const result = await uploadOnCloudinary(req.file.path, `profileImage/${user.username}`);
    user.image = { url: result.secure_url, publicId: result.public_id };
    fs.unlinkSync(req.file.path);
  }

  await user.save();

  if (designation && designation !== staff.designation) staff.designation = designation;
  if (manager && manager !== staff.manager.toString()) staff.manager = manager;
  if (salary && salary !== staff.salary) staff.salary = salary;

  await staff.save();

  res.status(200).json({
    success: true,
    message: "Staff updated successfully",
  });
});

export const updateManager = asyncErrorHandler(async (req: Request, res: Response) => {

  const { userId, name, username, email, password, role } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (name && name !== user.name) user.name = name;
  if (username && username !== user.username) user.username = username;
  if (email && email !== user.email) user.email = email;
  if (role && role !== user.role) user.role = role;
  if (password) user.password = password;

  if (req.file) {
    if (user.image?.publicId) {
      await cloudinary.uploader.destroy(user.image.publicId);
    }

    const result = await uploadOnCloudinary(req.file.path, `profileImage/${user.username}`);
    user.image = { url: result.secure_url, publicId: result.public_id };
    fs.unlinkSync(req.file.path);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Manager updated successfully",
  });
});

export const authenticateUser = asyncErrorHandler(
  async (req, res) => {
    const { password } = req.body;
    const userId = req.userId;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }


    const isMatch = await user.comparePassword(password);
    return res.json({ authenticated: isMatch });
  }
);