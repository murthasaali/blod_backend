import { sql, poolPromise } from '../config/databaseConfig.js';

// Function to get the count of likes for a specific post

const getLikeCount = async (postID) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('postID', sql.Int, postID)
        .query('SELECT COUNT(*) AS likeCount FROM Likes WHERE postID = @postID');
      return result.recordset[0].likeCount;
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  };

// Function to create a new like

const createLike = async ({ postID, userID }) => {
    try {
      // Check if the user has already liked the post
      const isLiked = await checkIfLiked(postID, userID);
      
      if (isLiked) {
        throw new Error('User has already liked this post');
      }
  
      const pool = await poolPromise;
      const result = await pool.request()
        .input('postID', sql.Int, postID)
        .input('userID', sql.Int, userID)
        .query('INSERT INTO Likes (postID, userID) VALUES (@postID, @userID)');
      
      return result;
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  };
  
  const checkIfLiked = async (postID, userID) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('postID', sql.Int, postID)
        .input('userID', sql.Int, userID)
        .query('SELECT COUNT(*) AS count FROM Likes WHERE postID = @postID AND userID = @userID');
      
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('SQL error', error);
      throw error;
    }
  };

export { getLikeCount, createLike ,checkIfLiked};
