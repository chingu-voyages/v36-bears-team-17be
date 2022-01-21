import express from 'express';
import { commentPost, updateComment, deleteComment, replyComment } from '../controllers/comment';

const router = express.Router({ mergeParams: true });

router.route('/').post(commentPost);
router.route('/:commentId').put(updateComment).delete(deleteComment);
router.route('/:commentId/reply').post(replyComment);

export default router;
