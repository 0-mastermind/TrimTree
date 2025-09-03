import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string; role: string };
    req.userId = decoded._id;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
}