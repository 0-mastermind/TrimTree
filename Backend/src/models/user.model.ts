import mongoose, { Model, Schema, model } from "mongoose";
import type { IUser } from "../types/type.js";
import { EnumUserRoles } from "../utils/constants.js";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: EnumUserRoles,
      required: true,
    },
  },
  { timestamps: true }
);


const UserModel: Model<IUser> =
  mongoose.models.User || model<IUser>("User", UserSchema);
export default UserModel;