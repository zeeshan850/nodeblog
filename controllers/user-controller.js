import { Login, User } from "../model/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
export const getAllUsers = async (req, res, next) => {
  const { id } = req.body;

  let users;

  try {
    users = await User.find({ _id: { $ne: id } });
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   if (err instanceof mongoose.Error.ValidationError) {
  //     // Handle validation errors from Mongoose schema
  //     const validationErrors = Object.values(err.errors).map(
  //       (error) => error.message
  //     );
  //     return res.status(400).json({ message: validationErrors });
  //   }
  //   // return res
  //   //   .status(400)
  //   //   .json({ message: "Please provide name, email, and password." });
  // }
  let extisingUser;
  try {
    extisingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }
  if (extisingUser) {
    return res.status(400).json({ message: "user is already registered." });
  }
  const hashPassword = !password ? password : bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashPassword,
  });
  try {
    await user.save();
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      // Handle validation errors from Mongoose schema
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ message: validationErrors });
    }
    console.log(err);
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "Please add email and password." });
  }
  const accessToken = jwt.sign({ name: email }, "secretkey");
  let existingUser;
  try {
    existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User is not registered." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = bcrypt.compareSync(password, existingUser.password);

    if (isPasswordMatch) {
      return res
        .status(200)
        .json({ message: "User is logged in.", token: accessToken });
    } else {
      return res.status(400).json({ message: "Invalid password." });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      // Handle validation errors from Mongoose schema
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ message: validationErrors });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
