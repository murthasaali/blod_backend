import { getLikeCount, createLike } from '../models/likeModal.js';

// like controller
const getLikeCountController = async (req, res, next) => {
  const { postID } = req.params;
  console.log(postID);
  try {
    const likeCount = await getLikeCount(postID);
    console.log(likeCount);
    res.status(200).json({ status: true, likeCount });
  } catch (error) {
    next(error);
  }
};


const createLikeController = async (req, res, next) => {
    const { postID } = req.params;
    const userID = req.user.userID;
    
    try {
      // Create a new like for the post
      await createLike({ postID, userID });
      
      // Get the updated like count for the post
      const likeCount = await getLikeCount(postID);
      
      // Send response with status 201 and updated likeCount
      res.status(201).json({
        status: true,
        message: 'Like added successfully',
        likeCount: likeCount
      });
    } catch (error) {
      // Check if the error is due to duplicate like
      if (error.message === 'User has already liked this post') {
        return res.status(400).json({
          status: false,
          message: 'you already liked this post'
        });
      }
      // Otherwise, pass any other errors to the error handling middleware
      next(error);
    }
  };

export { getLikeCountController, createLikeController };
