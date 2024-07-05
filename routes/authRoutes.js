import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { updateUserProfileController } from '../controllers/blogController.js';
import { Auth } from '../middlewares/Auth.js';
import { uploadMiddleware } from '../middlewares/fileupload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// router.put('/users/profile',Auth,uploadMiddleware, updateUserProfileController);

export default router;
