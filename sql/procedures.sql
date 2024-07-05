CREATE PROCEDURE AddBlogPost
  @userID INT,
  @title NVARCHAR(255),
  @content TEXT
AS
BEGIN
  INSERT INTO BlogPosts (userID, title, content, created_at) 
  VALUES (@userID, @title, @content, GETDATE());

  DECLARE @postCount INT;
  SET @postCount = (SELECT COUNT(*) FROM BlogPosts WHERE userID = @userID);
  
  UPDATE Users SET post_count = @postCount WHERE userID = @userID;
END
