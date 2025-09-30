import { Router } from "express";
import { createBranch, deleteStaff, getAllBranches, getBranchManagers, markPaymentOfEmployee } from "../controllers/admin.controller.js";
import { multerUpload } from "../middleware/multer.middleware.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";
import { getManagerNameByBranch } from "../controllers/manager.controller.js";

const adminRouter = Router();

const adminFiles = multerUpload.fields([
 {
  name: "branchImage",
  maxCount: 1,
 } 
]);

adminRouter.post("/create-branch", adminFiles, authMiddleware , adminMiddleware , createBranch);

adminRouter.get("/branches", authMiddleware, adminMiddleware, getAllBranches);

adminRouter.get("/managers" , authMiddleware, adminMiddleware, getBranchManagers);

adminRouter.delete("/delete/staff" , authMiddleware, adminMiddleware, deleteStaff);

adminRouter.delete("/delete/staff" , authMiddleware, adminMiddleware, deleteStaff);

adminRouter.get("/getManagerNameByBranch", authMiddleware , adminMiddleware , getManagerNameByBranch);

adminRouter.post("/mark-employee-payment", authMiddleware, adminMiddleware, markPaymentOfEmployee);

export default adminRouter