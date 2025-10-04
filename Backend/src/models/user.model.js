import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
      // unique: true,
      // trim: true,
      required: true,
    },
    age: {
      type: Number,
      min: 10,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // problemSolved : here reference the problem schema
  },
  { timestamps: ture }
);

export { userSchema };
