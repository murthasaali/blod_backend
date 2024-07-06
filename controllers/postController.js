import {
  getAllPosts,
  createPost,
  editPost,
  getPostByID,
  getPostByUserID,
  getPaginatedPosts,
  getTotalPostsCount,
  deletePost,
} from "../models/postModal.js";
import { findUserByID, updateUserProfile } from "../models/userModel.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";
import CustomError from "../utils/CustomError.js";
import fs from "fs";
const getAllPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json({ status: true, posts });
  } catch (error) {
    next(error);
  }
};

// blog controller

const createPostController = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userID = req.user.userID
    if (!(title && content)) {
      throw new CustomError("Please fill all the fields", 422);
    }
    const PostData = {
      title,
      content,
      authorID: userID,
    };
    if (req.file) {
      const imageUrl = req.file.path;
      const CloudImgResponse = await uploadToCloudinary(imageUrl, "Blink");
      PostData.imageUrl = CloudImgResponse.secure_url;
      fs.unlinkSync(imageUrl);
    }
    const newPost = await createPost(PostData);
    console.log(newPost);
    res
      .status(201)
      .json({
        status: true,
        message: "new Post created successfully",
        post: newPost,
      });
  } catch (error) {
    next(error);
  }
};


const editPostController = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    console.log(req.body)
    const { postId } = req.params;
    const userID = req.user.userID;

    console.log('Received data:', { postId, title, content, userID });

    if (!(title && content)) {
      throw new CustomError("Please fill all the fields", 422);
    }

    // Fetch the existing post
    const existingPost = await getPostByID(postId);
    console.log('Existing post:', existingPost);

    if (!existingPost) {
      throw new CustomError("Post not found", 404);
    }
    if (existingPost.authorID !== userID) {
      throw new CustomError("You are not authorized to edit this post", 403);
    }

    let imageUrl = existingPost.imageUrl;

    if (req.file) {
      const newImageUrl = req.file.path;
      const CloudImgResponse = await uploadToCloudinary(newImageUrl, "Blink");
      imageUrl = CloudImgResponse.secure_url;
      fs.unlinkSync(newImageUrl);

    }

    console.log('Updating post with:', { postID: postId, title, content, imageUrl });

    const updatedPost = await editPost({ postID: postId, title, content, imageUrl });

    console.log('Updated post:', updatedPost);

    res.status(200).json({
      status: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error in editPostController:', error);
    next(error);
  }
};


const deletePostController = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const userID = req.user.userID;
    if (!postID) {
      throw new CustomError("Post ID is required", 422);
    }

  
    try {
      const isDeleted = await deletePost(postID);
      if (isDeleted) {
        const posts = await getPostByUserID(userID);
        res.status(200).json({ status: true, message: "Post deleted successfully", posts });
      } else {
        throw new CustomError("Post not found", 404);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new CustomError("Failed to delete post", 500);
    }
  } catch (error) {
    next(error);
  }
};

const getPostByIDController = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const post = await getPostByID(postID);
    if (!post) {
      throw new CustomError("Post not found", 404);
    }
    const user = await findUserByID(post.authorID);
    user.password = undefined
    res.status(200).json({status:true, post,user});
  } catch (error) {
    next(error);
  }
};

const getUserByIDController = async (req, res, next) => {
  try {
    const { userID } = req.params;
    console.log(userID)
    const user = await findUserByID(userID);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.status(200).json({status:true, user});
  } catch (error) {
    next(error);
  }
};

const updateUserProfileController = async (req, res, next) => {
  try {
    const userID = req.user.userID;
    const token = req.user.token;
    if (!userID) {
      throw new CustomError("User not Valid", 422);
    }
    let profileURL = null
    if (req.file) {
      const imageUrl = req.file.path;
      const CloudImgResponse = await uploadToCloudinary(imageUrl, "Blink");
      console.log(CloudImgResponse);
      profileURL = CloudImgResponse.secure_url;
      fs.unlinkSync(imageUrl);
    }
    const updatedUser = await updateUserProfile(userID, profileURL);
    updatedUser.token = token
    res.status(200).json({status:true, message: "Profile Image successfully updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const getUserAllPosts = async (req, res, next) => {
  try {
    const userID = req.user.userID;
    if (!userID) {
      throw new CustomError("User ID is Not Found", 422);
    }
    const posts = await getPostByUserID(userID);
    res.status(200).json({status:true, message: "Data Featched", posts });
  } catch (error) {
    next(error);
  }
};

const getPaginatedPostsController = async (req, res,next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6; 
    const offset = (page - 1) * limit;

    const posts = await getPaginatedPosts(offset, limit);
    const totalPosts = await getTotalPostsCount();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      status:true,
      currentPage: page,
      totalPages: totalPages,
      posts: posts,
    });
  } catch (error) {
    next(error)
  }
};


export {
  getAllPostsController,
  createPostController,
  editPostController,
  deletePostController,
  getPostByIDController,
  updateUserProfileController,
  getUserByIDController,
  getUserAllPosts,
  getPaginatedPostsController
};
