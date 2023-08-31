import express from "express";
import { authenticateToken } from "../auth/auth";
import {
  commentOnPost,
  createPost,
  getALlCommentsOfPost,
  getAllPosts,
  likeOnPost,
} from "../controllers/post-controller";
import { getAllUsers, login, signup } from "../controllers/user-controller";

const router = express.Router();

router.post("/allUsers", authenticateToken, getAllUsers);
router.post("/signup", signup);
router.post("/login", login);

router.get("/allPosts", authenticateToken, getAllPosts);
router.post("/createPost", authenticateToken, createPost);
router.post("/commentOnPost", authenticateToken, commentOnPost);
router.post("/likeOnPost", authenticateToken, likeOnPost);
router.post("/allCommentOnPost", authenticateToken, getALlCommentsOfPost);

export default router;
