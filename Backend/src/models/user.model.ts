import {Schema, Model} from "mongoose";
import { availaibleUserRoles } from "../utils/constants.js";

const UserSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }, 
  role: {
   type: String,
   enum: availaibleUserRoles,
   required: true,
  }
}, {timestamps: true});

export const User = new Model("User", UserSchema);