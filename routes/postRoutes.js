import express from 'express';
import { getAllPostsController, createPostController, editPostController, deletePostController, getPostByIDController, getUserByIDController, getUserAllPosts, updateUserProfileController, getPaginatedPostsController } from '../controllers/postController.js';
import { uploadMiddleware } from '../middlewares/fileupload.js';
import { Auth } from '../middlewares/authMiddeware.js';


// router for postcontroller

const router = express.Router();

router.get('/posts', getAllPostsController);
router.get('/allposts', getPaginatedPostsController);
router.post('/posts', Auth,uploadMiddleware, createPostController);
router.put('/posts/:postId', Auth, uploadMiddleware, editPostController);
router.delete('/posts/:postID',Auth, deletePostController);
router.get('/posts/:postID', getPostByIDController);
router.get('/getuser/:userID', getUserByIDController)
router.get('/getuserpost',Auth, getUserAllPosts)
router.put('/users/profile',Auth,uploadMiddleware, updateUserProfileController);
export default router;
