import { Router } from "express";
import { authMiddleware , staffMiddleware } from "../middleware/auth.middleware.js";
import { applyForAttendance, applyForLeave } from "../controllers/staff.controller.js";

const staffRouter = Router();

staffRouter.post("/apply-attendance", authMiddleware ,staffMiddleware , applyForAttendance);  

staffRouter.post("/apply-leave", authMiddleware ,staffMiddleware , applyForLeave)



export default staffRouter;
