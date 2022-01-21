import express from 'express';
import { commentPost, updateComment, deleteComment } from '../controllers/comment';

const router = express.Router({ mergeParams: true });

router.route('/').post(commentPost);
router.route('/:commentId').put(updateComment).delete(deleteComment);

export default router;
