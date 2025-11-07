import express from "express";
import { addToSlider, createReview, deleteReview, deleteSliderItem, fetchReviewById, fetchSlideById, getAllReviews, getEmployees, getSliderItems, updateReview, updateSliderItem } from "../controllers/landingPage.controller.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";
import { multerUpload } from "../middleware/multer.middleware.js";

const landingPageRouter = express.Router();

landingPageRouter.get("/reviews" , getAllReviews);
landingPageRouter.post("/reviews/create" , authMiddleware , adminMiddleware , createReview);
landingPageRouter.patch("/reviews/update/:id" , authMiddleware , adminMiddleware , updateReview);
landingPageRouter.delete("/reviews/delete/:id" , authMiddleware , adminMiddleware , deleteReview);
landingPageRouter.get("/reviews/:id" , authMiddleware , adminMiddleware , fetchReviewById);
landingPageRouter.get("/employees" , getEmployees);
landingPageRouter.post("/slider/create" , authMiddleware , adminMiddleware ,multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 3 }, 
  ]), addToSlider);
landingPageRouter.patch("/slider/update/:id" , authMiddleware , adminMiddleware ,multerUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 3 }, 
  ]), updateSliderItem);
landingPageRouter.get("/slider" , authMiddleware , adminMiddleware , getSliderItems);
landingPageRouter.get("/slider/:id" , authMiddleware , adminMiddleware , fetchSlideById);
landingPageRouter.delete("/slider/delete/:id" , authMiddleware , adminMiddleware , deleteSliderItem);

export default landingPageRouter;