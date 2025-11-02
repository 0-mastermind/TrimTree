import mongoose, { Model, Schema, model } from "mongoose";
import type { IReviews } from "../types/type.js";

const Reviews = new Schema<IReviews>(
  {
    customerName: {
        type: String,
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 1,
    },
    comment: {
        type: String,
        required: true, //max 300 chars
    }, 
  },
  { timestamps: true }
);


const ReviewsModel: Model<IReviews> =
  mongoose.models.Reviews || model<IReviews>("Reviews", Reviews);
export default ReviewsModel;