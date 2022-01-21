import { asyncHandler } from "../middlewares/async";
import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../types/express';
import ErrorResponse from "../utils/errorResponse";
import { Comments } from "../models/Comment";
import { Post } from "../models/Post";


// @desc      Comment on a Post
// @route     POST /api/auth/posts/:postId/comments
// @access    Private
export const commentPost = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { body } = req.body;
    const { postId } = req.params;
    req.body.user = req.user.id;
    req.body.post = postId;

    const post = await Post.findById(postId);

    if (!body) {
      return next(new ErrorResponse('Comments need `body` parameter.', 401))
    }

    if (!post) {
      return next(new ErrorResponse('Comment needs to be attached to a `post`.', 401));
    }

    const comment = await Comments.create(req.body);

    post.comments.push(comment);

    await post.save();

    res.json({ message: 'success', data: comment });
  }
);

// @desc      Update a Comment
// @route     PUT /api/auth/posts/:postId/comments/:commentId
// @access    Private
export const updateComment = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let comment = await Comments.findById(req.params.commentId);

    if (!comment) {
      return next(new ErrorResponse(`No comment found with that Id`, 404));
    }

    if (comment.user._id.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse(`You are not authorized to update the comment`, 403)
      );
    }

    comment = await Comments.findByIdAndUpdate(req.params.commentId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'success', data: comment });
  }
);

// @desc      Delete a Comment
// @route     DELETE /api/auth/posts/:postId/comments/:commentId
// @access    Private
export const deleteComment = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let comment = await Comments.findById(req.params.commentId).populate('post');

    console.log({comment})

    if (!comment) {
      return next(new ErrorResponse(`No comment found with that Id`, 404));
    }

    if (comment.user._id.toString() !== req.user._id.toString() ||
      comment.post.user._id.toString() !== req.user._id.toString()) 
    {
      return next(
        new ErrorResponse(`You are not authorized to delete the comment`, 401)
      );
    }

    await Comments.findByIdAndDelete(req.params.commentId);

    res.sendStatus(204);
  }
);

