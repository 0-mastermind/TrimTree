  import "./utils/dotenv.config.js";
  import express from "express";
  import type { Request, Response, NextFunction } from "express";
  import cookieParser from "cookie-parser";
  import cors from "cors";
  import http from "http";
  import dbConnect from "./config/database.js";
  import authRouter from "./routes/auth.routes.js";
  import { ApiError } from "./utils/ApiError.js";
  import managerRouter from "./routes/manager.routes.js";
  import staffRouter from "./routes/staff.routes.js";
  import adminRouter from "./routes/admin.routes.js";
  import { initSocket } from "./socketio.js";
  import landingPageRouter from "./routes/landingPage.routes.js";
  import appointmentRouter from "./routes/appointment.routes.js";

  async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3030;
    const whitelist = process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3000",
      "http://localhost:4173",
      "https://trimtreesalon.in",
    ];

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
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    );

    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/manager", managerRouter);
    app.use("/api/staff", staffRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/landingpage", landingPageRouter);
    app.use("/api/appointments", appointmentRouter);

    app.get("/health", async (req: Request, res: Response) => {
      try {
        res.status(200).json({ status: "healthy" });
      } catch (error) {
        res.status(503).json({ status: "unhealthy" });
      }
    });

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

    // Create HTTP server and init socket.io
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  }

  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
