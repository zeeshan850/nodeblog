import mongoose from "mongoose";

const Schema = mongoose.Schema;
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User schema's _id
    ref: "User", // The model to which it refers (User)
    required: true,
  },
  comments: [
    {
      text: { type: String },
      author: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User schema's _id
        ref: "User", // The model to which it refers (User)
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      catagory: {
        type: String,
        enum: ["1", "2", "3"],
        required: true,
        validate: {
          validator: function (value) {
            // Define the allowed enum values
            const allowedValues = ["1", "2", "3"];
            // Check if the value is one of the allowed values
            return allowedValues.includes(value);
          },
          message: (props) =>
            `${props.value} is not a valid catagory. Valid catagory are 1, 2, or 3.`,
        },
      },
      author: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User schema's _id
        ref: "User", // The model to which it refers (User)
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
export const Post = mongoose.model("Post", postSchema);
