import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
});
const loginUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", userSchema);
export const Login = mongoose.model("Login", loginUserSchema);
