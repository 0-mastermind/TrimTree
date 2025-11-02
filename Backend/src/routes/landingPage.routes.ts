import express from "express";
import { createReview, deleteReview, getAllReviews, getEmployees, updateReview } from "../controllers/landingPage.controller.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const landingPageRouter = express.Router();

landingPageRouter.get("/reviews" , getAllReviews);
landingPageRouter.post("/reviews/create" , authMiddleware , adminMiddleware , createReview);
landingPageRouter.patch("/reviews/update/:id" , authMiddleware , adminMiddleware , updateReview);
landingPageRouter.delete("/reviews/delete/:id" , authMiddleware , adminMiddleware , deleteReview);
landingPageRouter.get("/employees" , getEmployees);

export default landingPageRouter;