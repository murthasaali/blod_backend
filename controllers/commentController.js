import { getAllComments, createComment } from '../models/commentModel.js';


// comment controller
const getAllCommentsController = async (req, res, next) => {
  const { postID } = req.params;
  console.log(postID)
  try {
    const comments = await getAllComments(postID);
    console.log(comments);
    res.status(200).json({status:true,comments});
  } catch (error) {
    next(error)
  }
};

const createCommentController = async (req, res, next) => {
  const { postID } = req.params;
  const { content } = req.body;
  const userID = req.user.userID
  try {
    console.log("content :" + content);
    const result = await createComment({ postID, userID, content });
    const allcomments = await getAllComments(postID)
    res.status(201).send({status:true, message:'Comment added successfully',comments:allcomments});
  } catch (error) {
    next(error)
  }
};

export { getAllCommentsController, createCommentController };
