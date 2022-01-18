import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../middlewares/async'
import { Post } from '../models/Post'
import { User } from '../models/User'
import { Like } from '../models/Like'
import { Comments } from '../models/Comment'
import ErrorResponse from '../utils/errorResponse'

// @desc      Get a Single Post
// @route     GET /api/auth/posts/:id
// @access    Private

export const getPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Get posts of the current loggedin user
// @route     GET /api/auth/posts
// @access    Private

export const getPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Create a new Post
// @route     POST /api/auth/posts
// @access    Private

export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Update a Post
// @route     PUT /api/auth/posts/:id
// @access    Private

export const updatePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Delete a Post
// @route     DELETE /api/auth/posts/:id
// @access    Private

export const deletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Get posts by user
// @route     PUT /api/auth/posts/:username
// @access    Private

export const userPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Get posts by search
// @route     PUT /api/auth/posts/search
// @access    Private

export const searchPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
)

// @desc      Like a Post
// @route     POST /api/auth/posts/:id/like
// @access    Private

export const likePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)

// @desc      Comment on a Post
// @route     POST /api/auth/posts/:id/comment
// @access    Private

export const commentPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

  }
)
