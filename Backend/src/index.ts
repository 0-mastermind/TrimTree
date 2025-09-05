import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./config/database.js";
import authRouter from "./routes/auth.routes.js";
import { ApiError } from "./utils/ApiError.js"; 
import managerRouter from "./routes/manager.routes.js";
import staffRouter from "./routes/staff.routes.js";
async function startServer() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3030;
  const whitelist =
    process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());

  // DB connect
  await dbConnect();

  // CORS setup
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/manager", managerRouter);
  app.use("/api/staff", staffRouter);

  // Global error handler 
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        errors: err.errors,
      });
    }

    console.error(err); 
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  });

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
