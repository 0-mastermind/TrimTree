import { Router } from "express";
import { createBranch, deleteStaff, getAllBranches, getBranchesOwned, getBranchManagers, getMonthlyAttendance, markPaymentOfEmployee } from "../controllers/admin.controller.js";
import { multerUpload } from "../middleware/multer.middleware.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";
import { getManagerNameByBranch } from "../controllers/manager.controller.js";
import { createCategory, createService, deleteCategory, deleteService, getAllCategories, getAllServices, getServicesByCategory, updateCategory, updateService } from "../controllers/category_services.controller.js";


const adminRouter = Router();

const adminFiles = multerUpload.fields([
 {
  name: "branchImage",
  maxCount: 1,
 } 
]);

adminRouter.post("/create-branch", adminFiles, authMiddleware , adminMiddleware , createBranch);

adminRouter.get("/branches", authMiddleware, adminMiddleware, getAllBranches);

adminRouter.get("/branches/owned", authMiddleware, adminMiddleware, getBranchesOwned);

adminRouter.get("/managers" , authMiddleware, adminMiddleware, getBranchManagers);

adminRouter.delete("/delete/staff" , authMiddleware, adminMiddleware, deleteStaff);

adminRouter.delete("/delete/staff" , authMiddleware, adminMiddleware, deleteStaff);

adminRouter.get("/getManagerNameByBranch", authMiddleware , adminMiddleware , getManagerNameByBranch);

adminRouter.post("/mark-employee-payment", authMiddleware, adminMiddleware, markPaymentOfEmployee);

adminRouter.get("/attendance/monthly" , authMiddleware , adminMiddleware , getMonthlyAttendance);   

adminRouter.post("/create/category" , authMiddleware , adminMiddleware , multerUpload.single("image") , createCategory);

adminRouter.patch("/update/category" , authMiddleware , adminMiddleware , multerUpload.single("image") , updateCategory);

adminRouter.get("/categories" , authMiddleware  , getAllCategories);

adminRouter.delete("/delete/category" , authMiddleware , adminMiddleware , deleteCategory);

adminRouter.post("/create/service" , authMiddleware , adminMiddleware , createService);

adminRouter.get("/services" , authMiddleware , getAllServices); 

adminRouter.patch("/update/service" , authMiddleware , adminMiddleware , updateService);

adminRouter.delete("/delete/service" , authMiddleware , adminMiddleware , deleteService);

adminRouter.get("/service-by-category" , authMiddleware , getServicesByCategory);

export default adminRouter