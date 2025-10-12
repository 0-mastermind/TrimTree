import mongoose, { Model, Schema, model } from "mongoose";
import type { IUser } from "../types/type.js";
import {  EnumUserRoles, userRoles } from "../utils/constants.js";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import '../utils/dotenv.config.js'

const JWT_SECRET = process.env.JWT_SECRET as string;

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
      lowercase: true,
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
    branch: {
      type : Schema.Types.ObjectId,
      ref: 'Branch',
      required: function () {
        return this.role !== userRoles.ADMIN; // required if role is not admin
      },
    }
  },
  { timestamps: true }
);


// Pre-save hook to hash the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) {
    throw new Error("Password not set on user document.");
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      branch: this.branch,
    },
    JWT_SECRET,
    { expiresIn: "6h" }
  );
};

const UserModel: Model<IUser> =
  mongoose.models.User || model<IUser>("User", UserSchema);
export default UserModel;
