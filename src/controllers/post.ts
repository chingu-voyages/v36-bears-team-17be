import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/async";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Like } from "../models/Like";
import { Comments } from "../models/Comment";
import ErrorResponse from "../utils/errorResponse";
import { RequestWithUser } from "../types/express";

// @desc      Get a Single Post
// @route     GET /api/auth/posts/:id
// @access    Private

export const getPost = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id)
      // .populate('likes')
      .populate("comments")
      .populate({ path: "user", select: "_id username displayName" });

    if (!post) {
      return next(new ErrorResponse(`The requested post does not exist`, 401));
    }

    res.status(200).json({ message: "success", data: post });
  }
);

// @desc      Get posts of the current loggedin user
// @route     GET /api/auth/posts
// @access    Private

export const getPosts = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const posts = await Post.find({ user: req.user._id })
      .populate("likes")
      .populate("comments")
      .populate({ path: "user", select: "_id username displayName" });
    res.status(200).json({ count: posts.length, success: true, data: posts });
  }
);

// @desc      Create a new Post
// @route     POST /api/auth/posts
// @access    Private

export const createPost = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { title, description } = req.body;
    req.body.user = req.user.id;
    if (!title || !description) {
      return next(new ErrorResponse(`Please add a title, description`, 404));
    }

    const post = await Post.create(req.body);

    res.status(200).json({ message: "success", data: post });
  }
);

// @desc      Update a Post
// @route     PUT /api/auth/posts/:id
// @access    Private

export const updatePost = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorResponse(`No post found with that Id`, 404));
    }

    if (post.user._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse(`You are not authorized to update the post`, 403)
      );
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "user", select: "_id username displayName" })
      .populate("comments")
      .populate("likes");

    res.status(200).json({ message: "success", data: post });
  }
);

// @desc      Delete a Post
// @route     DELETE /api/auth/posts/:id
// @access    Private

export const deletePost = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ErrorResponse(`No post found with that Id`, 404));
    }

    if (post.user._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse(`You are not authorized to update the post`, 401)
      );
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "success", data: {} });
  }
);

// @desc      Get posts by user
// @route     PUT /api/auth/posts/:username
// @access    Private

export const userPosts = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return next(new ErrorResponse(`The profile doesn't exist`, 404));
    }

    const posts = await Post.find({ user: user._id })
      .populate("comments")
      .populate("likes");
    res.status(200).json({ count: posts.length, success: true, data: posts });
  }
);

// @desc      Get posts by search
// @route     PUT /api/auth/posts/search
// @access    Private

export const searchPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// @desc      Like a Post
// @route     POST /api/auth/posts/:id/like
// @access    Private

export const likePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id).populate("likes");

    if (!post) {
      return next(new ErrorResponse("The requested post does no exist", 401));
    }
    //Loads like
    let like = await Like.where("post")
      .equals(post)
      .where("user")
      .equals(req.body.user);

    if (!like) {
      //if there is no like
      const aLike = await Like.create(req.body);
      post.likes.push(aLike);

      await post.save();
      res.status(200).json({ message: "liked" });
    } else {
      // TO DO: if there is a like  FIX: change deleteOne()
      await Like.deleteOne(like);
      res.status(200).json({ message: "unliked" });
    }
  }
);
