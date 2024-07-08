import express from 'express';
import { getLikeCountController, createLikeController } from '../controllers/likeController.js';
import { Auth } from '../middlewares/authMiddeware.js';

// Router for like controller
const router = express.Router();

router.get('/posts/:postID/likes', getLikeCountController);
router.post('/posts/:postID/likes', Auth, createLikeController);

export default router;
