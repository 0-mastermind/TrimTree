import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.token;

  if (!token) {
   throw new ApiError(401 , "No token, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; role: string; branch : string };
    req.userId = decoded._id;
    req.role = decoded.role;
    req.branch = decoded.branch;
    next();
  } catch (err) {
    throw new ApiError(401 , "Invalid token, authorization denied");
  }
}


export const staffMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "STAFF") {
    throw new ApiError(403, "Access denied: Staff only");
  }
  next();
};


export const managerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "MANAGER") {
    throw new ApiError(403, "Access denied: Manager only");
  }
  next();
};


export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin only");
  }
  next();
};