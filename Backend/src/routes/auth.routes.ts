import { Router, type NextFunction } from "express";
import { getUserProfile, loginStaff, loginAdminManager , logout, registerUser } from "../controllers/auth.controller.js";
import { admin_managerMiddleware, adminMiddleware, authMiddleware, managerMiddleware } from "../middleware/auth.middleware.js";
import { multerUpload } from "../middleware/multer.middleware.js";

const authRouter = Router();

authRouter.post("/register", authMiddleware ,admin_managerMiddleware, multerUpload.single("image"),registerUser);  

authRouter.post("/login/staff" , loginStaff); 

authRouter.post("/login/admin" , loginAdminManager);  

authRouter.post("/logout", authMiddleware , logout); 

authRouter.get("/profile" , authMiddleware , getUserProfile);


export default authRouter;
