import express from 'express'
import { registerUser, loginUser, getMe, updateProfile, updatePassword } from '../controllers/auth'
import { protect } from '../middlewares/auth';

const router:any = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

router.route('/profile').get(protect, getMe);
router.route('/updateprofile').put(protect, updateProfile);
router.route('/updatepassword').put(protect, updatePassword);

export default router
