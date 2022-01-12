import {Request,Response,NextFunction,RequestHandler} from 'express';
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../middlewares/async';
import ErrorResponse from '../utils/errorResponse'
import { User } from '../models/User'

export const protect:RequestHandler = asyncHandler(async (req: Request | any, res:Response, next:NextFunction) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token) {
    console.log('token', req.cookies.token)
    token = req.cookies.token
  }

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401))
  }

  try {
    const decoded:any = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  } catch (e) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401))
  }
})