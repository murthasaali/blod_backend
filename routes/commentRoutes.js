import express from 'express';
import { getAllCommentsController, createCommentController } from '../controllers/commentController.js';
import { Auth } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/posts/:postID/comments', getAllCommentsController);
router.post('/posts/:postID/comments',Auth, createCommentController);

export default router;
