import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import demoRouter from "./routes/demo.routes.js";
import dbConnect from "./config/database.js";
async function startServer() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3030;
  const whitelist = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());

  // DB connect
//   await dbConnect();


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
  app.use("/api/demo", demoRouter);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
