import { sql, poolPromise } from '../config/databaseConfig.js';




const getAllPosts = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
          p.*,
          u.username,
          u.email,
          COUNT(l.likeID) AS likeCount
      FROM 
          Posts p
      JOIN 
          Users u ON p.authorID = u.userID
      LEFT JOIN 
          Likes l ON p.postID = l.postID
      GROUP BY 
          p.postID, p.title, p.content, p.authorID, p.created_at, p.imageUrl, u.username, u.email
      ORDER BY 
          p.created_at DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
};

const createPost = async ({ title, content, authorID, imageUrl }) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content)
      .input('authorID', sql.Int, authorID)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`INSERT INTO Posts (title, content, authorID, imageUrl) 
              OUTPUT INSERTED.postID, INSERTED.title, INSERTED.content, INSERTED.authorID, INSERTED.created_at, INSERTED.imageUrl
              VALUES (@title, @content, @authorID, @imageUrl)`);
    return result.recordset[0];
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
};

const editPost = async ({ postID, title, content, imageUrl }) => {
  try {
    console.log('editPost function called with:', { postID, title, content, imageUrl });

    const pool = await poolPromise;
    
    // First, update the post
    await pool.request()
      .input('postID', sql.Int, postID)
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        UPDATE Posts
        SET title = @title, content = @content, imageUrl = @imageUrl
        WHERE postID = @postID
      `);

    // Then, fetch the updated post
    const result = await pool.request()
      .input('postID', sql.Int, postID)
      .query(`
        SELECT postID, title, content, authorID, created_at, imageUrl
        FROM Posts
        WHERE postID = @postID
      `);

    console.log('SQL query result:', result);

    if (result.recordset.length === 0) {
      throw new Error('No rows were updated');
    }

    return result.recordset[0];
  } catch (error) {
    console.error('SQL error in editPost:', error);
    throw error;
  }
};

const deletePost = async (postID) => {
  try {
    const pool = await poolPromise;
    const transaction = await new sql.Transaction(pool);

    try {
      await transaction.begin();

      // First, delete comments related to the post
      await transaction.request()
        .input('postID', sql.Int, postID)
        .query('DELETE FROM Comments WHERE postID = @postID');

      // Then, delete the post itself
      await transaction.request()
        .input('postID', sql.Int, postID)
        .query('DELETE FROM Posts WHERE postID = @postID');

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
};



const getPostByID = async (postID) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('postID', sql.Int, postID)
      .query('SELECT * FROM Posts WHERE postID = @postID');
    return result.recordset[0];
  } catch (error) {
    console.error('SQL error', error);
    throw error;
  }
};


const getPostByUserID = async (authorID) => {
  try {

    if (isNaN(authorID)) {
      throw new Error('authorID must be a valid integer');
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('authorID', sql.Int, authorID)
      .query('SELECT * FROM Posts WHERE authorID = @authorID');

    return result.recordset; 
  } catch (error) {
    console.error('SQL error', error);
    throw error; 
  }
};


const getPaginatedPosts = async (offset, limit) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`SELECT * FROM Posts
              ORDER BY created_At DESC
              OFFSET @offset ROWS
              FETCH NEXT @limit ROWS ONLY`);
    return result.recordset;
  } catch (error) {
    console.error('SQL error', error);
  }
};

const getTotalPostsCount = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT COUNT(*) AS count FROM Posts');
    return result.recordset[0].count;
  } catch (error) {
    console.error('SQL error', error);
  }
};

export { getAllPosts, createPost, editPost, deletePost, getPostByID, getPostByUserID,getTotalPostsCount ,getPaginatedPosts};
