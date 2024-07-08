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
    console.log("postID :" + postID);
    const result = await createLike({ postID, userID });
    const likeCount = await getLikeCount(postID);
    res.status(201).send({ status: true, message: 'Like added successfully', likeCount });
  } catch (error) {
    next(error);
  }
};

export { getLikeCountController, createLikeController };
