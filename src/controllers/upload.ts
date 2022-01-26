import cloudinary from 'cloudinary';
import { cloudinaryConfig } from '../config/cloudinary';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types/express';

const cloudName = cloudinaryConfig.cloud_name;
const apiKey = cloudinaryConfig.api_key;
const apiSecret = cloudinaryConfig.api_secret;

const cloudinarySignature = () => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.v2.utils.api_sign_request(
        {
            timestamp: timestamp,
            eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
            folder: 'posts',
        },
        apiSecret
    );
    return { timestamp, signature };
};

// @desc      Upload the image file to cloudinary and return a url
// @route     GET /api/upload/image
// @access    Private

// In the frontend send a request to /api/upload/image . In the response, you will get the
// api_key, timestamp, signature,cloudname,.Then send a POST request to cloudinary api
// 'https://api.cloudinary.com/v1_1/' + cloudname + '/auto/upload'. The body should have the
//  formData which should include  file, api_key, timestamp, signature, cloudname, eager, folder

export const uploadImage = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const sig = cloudinarySignature();

    res.json({
        signature: sig.signature,
        timestamp: sig.timestamp,
        cloudname: cloudName,
        apikey: apiKey,
    });
};
