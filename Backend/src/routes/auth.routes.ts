import { Router } from "express";
import { getUserProfile, loginUser, logout, registerUser } from "../controllers/auth.controller.js";
import { admin_managerMiddleware, adminMiddleware, authMiddleware, managerMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authMiddleware ,admin_managerMiddleware,registerUser);  

authRouter.post("/login" , loginUser);  

authRouter.post("/logout", authMiddleware , logout); 

authRouter.get("/profile" , authMiddleware , getUserProfile);


export default authRouter;
