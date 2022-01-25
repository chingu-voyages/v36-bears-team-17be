import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middlewares/async';
import ErrorResponse from '../utils/errorResponse';
import { User } from '../models/User';
import { RequestWithUser } from '../types/express';
import { sendTokenResponse } from '../utils/sendTokenResponse';

// @desc      Register a new User
// @route     POST /api/v1/auth/register
// @access    Public

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.create(req.body);
        sendTokenResponse(user, 200, res);
    }
);

// @desc      Login route for a User
// @route     POST /api/v1/auth/login
// @access    Public

export const loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, username, password } = req.body;
        if (!(email || username) || !password) {
            return next(
                new ErrorResponse(
                    `email or username and a password is required`,
                    400
                )
            );
        }
        let loginType;

        if (email) {
            loginType = { email: `${email}` };
        } else {
            loginType = { username: `${username}` };
        }
        const user = await User.findOne(loginType).select('+password');
        if (!user) {
            return next(new ErrorResponse(`Invalid Credentials`, 401));
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse(`Invalid Credentials`, 401));
        }

        sendTokenResponse(user, 200, res);
    }
);

// @desc      Get current loggedin user
// @route     GET /api/auth/me
// @access    Private

export const getMe = asyncHandler(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    }
);

// @desc      Update profile of the loggedin user
// @route     PUT /api/auth/updateprofile
// @access    Private

export const updateProfile = asyncHandler(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const fields = {
            name: req.body.name,
            email: req.body.email,
            ...req.body,
        };
        const user = await User.findByIdAndUpdate(req.user.id, fields, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: user });
    }
);

// @desc      Update password of the loggedin user
// @route     PUT /api/auth/updatepassword
// @access    Private

export const updatePassword = asyncHandler(
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const user = await User.findById(req.user.id).select('+password');

        // check current password
        if (!user.matchPassword(req.body.currentPassword)) {
            return next(new ErrorResponse(`Password is incorrect`, 401));
        }
        user.password = req.body.newPassword;
        await user.save();
        sendTokenResponse(user, 200, res);
    }
);
