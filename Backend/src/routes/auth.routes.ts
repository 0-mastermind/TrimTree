import { Router, type NextFunction } from "express";
import { getUserProfile, loginStaff, loginAdminManager , logout, registerUser, updateStaff, updateManager, authenticateUser } from "../controllers/auth.controller.js";
import { admin_managerMiddleware, authMiddleware, } from "../middleware/auth.middleware.js";
import { multerUpload } from "../middleware/multer.middleware.js";

const authRouter = Router();

authRouter.post("/register", authMiddleware ,admin_managerMiddleware, multerUpload.single("image"),registerUser);  

authRouter.post("/login/staff" , loginStaff); 

authRouter.post("/login/admin" , loginAdminManager);  

authRouter.post("/logout", authMiddleware , logout); 

authRouter.get("/profile" , authMiddleware , getUserProfile);

authRouter.patch("/update/staff" , authMiddleware , multerUpload.single("image"), updateStaff);

authRouter.patch("/update/manager" , authMiddleware , multerUpload.single("image"), updateManager);

authRouter.get("/authenticate", authMiddleware, authenticateUser);


export default authRouter;
