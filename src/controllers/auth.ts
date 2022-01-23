import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/async'
import ErrorResponse from '../utils/errorResponse'
import { User } from '../models/User'
import { sendTokenResponse } from '../utils/sendTokenResponse'

// @desc      Register a new User
// @route     POST /api/v1/auth/register
// @access    Public

export const registerUser = asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
  const user = await User.create(req.body)
  sendTokenResponse(user, 200, res)
})

// @desc      Login route for a User
// @route     POST /api/v1/auth/login
// @access    Public

export const loginUser = asyncHandler(async (req: Request, res: Response, next:NextFunction) => { 
    const { email, username, password } = req.body
    if (!(email || username) || !password) {
      return next(
        new ErrorResponse(`email or username and a password is required`, 400)
      )
    }
    let loginType

    if (email) {
      loginType = { email: `${email}` }
    } else {
      loginType = { username: `${username}` }
    }
    const user = await User.findOne(loginType).select('+password')
    if (!user) {
      return next(new ErrorResponse(`Invalid Credentials`, 401))
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return next(new ErrorResponse(`Invalid Credentials`, 401))
    }

    sendTokenResponse(user, 200, res)
})