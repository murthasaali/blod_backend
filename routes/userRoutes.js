import express from 'express';
import { register, login, logout } from '../controllers/userController.js';
import { updateUserProfileController } from '../controllers/postController.js';
import { Auth } from '../middlewares/authMiddeware.js';
import { uploadMiddleware } from '../middlewares/fileupload.js';

// router for auth controller

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// router.put('/users/profile',Auth,uploadMiddleware, updateUserProfileController);

export default router;
