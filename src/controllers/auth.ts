import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/async'
import ErrorResponse from '../utils/errorResponse'
import { User } from '../models/User'
import { sendTokenResponse } from '../utils/sendTokenResponse'

// @desc      Register a new User
// @route     POST /api/v1/auth/register
// @access    Public

export const registerUser = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
  const user:any = await User.create(req.body)
  sendTokenResponse(user, 200, res)
})

// @desc      Login route for a User
// @route     POST /api/v1/auth/login
// @access    Public

export const loginUser = asyncHandler(async (req: Request, res: Response, next:NextFunction) => { })