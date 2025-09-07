import mongoose, { Model, model, Schema } from "mongoose";
import type { IBranches } from "../types/type.js";

const BranchSchema = new Schema<IBranches>(
  {
    name: {
      type: String,
      required: true,
    },
    branchImage: {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const branchModel: Model<IBranches> =
  mongoose.models.Branch || model<IBranches>("Branch", BranchSchema);

export default branchModel;