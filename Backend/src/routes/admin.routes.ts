import { Router } from "express";
import { createBranch } from "../controllers/admin.controller.js";
import { multerUpload } from "../middleware/multer.middleware.js";

const adminRouter = Router();

const adminFiles = multerUpload.fields([
 {
  name: "branchImage",
  maxCount: 1,
 } 
]);

adminRouter.post("/create-branch", adminFiles, createBranch);

export default adminRouter