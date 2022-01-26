import express from 'express';
import { protect } from '../middlewares/auth';
import { uploadImage } from '../controllers/upload';

const router: any = express.Router();

router.route('/image').get( uploadImage);

export default router;
