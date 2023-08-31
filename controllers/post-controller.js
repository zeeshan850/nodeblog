import mongoose from "mongoose";
import { Post } from "../model/post";
import { User } from "../model/user";

export const getAllPosts = async (req, res, next) => {
  const postId = req.query.id;
  let posts;
  try {
    if (postId) {
      posts = await Post.findOne({ _id: postId });
    } else {
      posts = await Post.find();
    }
  } catch (err) {
    console.log(err);
  }
  if (!posts) {
    return res.status(404).json({ message: "No posts found" });
  }
  return res.status(200).json({ posts });
};
//creating a post///
export const createPost = async (req, res, next) => {
  const { title, content, authorId } = req.body;
  let author;
  try {
    if (authorId) {
      author = await User.findOne({ _id: authorId });
    } else {
      return res.status(404).json({ message: "Please add authorId" });
    }
  } catch (err) {
    console.log(err);
  }
  const post = new Post({
    title,
    content,
    author: author._id,
  });
  try {
    await post.save();
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
  return res.status(201).json({ post });
};
//comment on a post
export const commentOnPost = async (req, res, next) => {
  const { comment, authorId, postId } = req.body;
  let author;
  let post;
  try {
    if (authorId) {
      author = await User.findOne({ _id: authorId });
    } else {
      return res.status(404).json({ message: "Please add authorId" });
    }
  } catch (err) {
    console.log(err);
  }

  try {
    // post = await Post.findOne({ _id: postId });
    const commentOnPost = { text: comment, author: author._id };
    // post.comments.push(commentOnPost);
    await Post.updateOne(
      { _id: postId },
      { $push: { comments: commentOnPost } }
    );
    // await post.save();
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
  return res.status(201).json({ message: "comment add on post" });
};
//like on a post
export const likeOnPost = async (req, res, next) => {
  const { likeType, authorId, postId } = req.body;
  let author;
  let like;
  try {
    author = await User.findOne({ _id: authorId });
  } catch (err) {
    return res.status(404).json({ message: "Please add authorId" });
  }

  try {
    like = await Post.findOne(
      { _id: postId, "likes.author": authorId },
      { "likes.$": 1 }
    ).lean();
    const likeOnPost = { catagory: likeType, author: author._id };
    // console.log(like, "like");
    if (!["1", "2", "3"].includes(likeType)) {
      return res.status(404).json({
        message: `Please add likeType ${likeType} is not a valid catagory. Valid likeType are 1, 2, or 3`,
      });
    }
    if (!like)
      await Post.updateOne({ _id: postId }, { $push: { likes: likeOnPost } });
    if (like)
      await Post.updateOne(
        { _id: postId, "likes.author": authorId },
        { $set: { "likes.$.catagory": likeType } }
      )
        .exec()
        .then((result) => {
          // Handle the query result here
          console.log(result, "result");
        })
        .catch((err) => {
          // Handle any errors here
          console.log(err, "error");
        });
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
  return res.status(201).json({ message: "like add on post" });
};
//getAllPosts
export const getALlCommentsOfPost = async (req, res, next) => {
  const { authorId, postId } = req.body;
  let author;
  let post;
  let allComments;
  try {
    if (authorId) {
      author = await User.findOne({ _id: authorId });
    } else {
      return res.status(404).json({ message: "Please add authorId" });
    }
  } catch (err) {
    console.log(err);
  }

  try {
    allComments = await Post.findOne({ _id: postId }).select("comments.text");
    //   allComments= post.comments;
    // await post.save();
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
  return res.status(200).json({ allComments });
};
