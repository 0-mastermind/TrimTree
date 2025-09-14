import { Router } from "express";
import { createBranch } from "../controllers/admin.controller.js";
import { multerUpload } from "../middleware/multer.middleware.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const adminRouter = Router();

const adminFiles = multerUpload.fields([
 {
  name: "branchImage",
  maxCount: 1,
 } 
]);

adminRouter.post("/create-branch", adminFiles, authMiddleware , adminMiddleware , createBranch);

export default adminRouter