// utils/commentUtils.js
export const formatComments = (apiComments) => {
    // First, map all comments by ID for quick lookup
    const commentMap = {};
    
    apiComments.forEach(comment => {
      commentMap[comment.ID] = {
        id: comment.ID,
        estimateId: comment.Module_Record_Id,
        parentCommentId: comment.Parent_Comment_Id || null,
        text: comment.Body,
        author: {
          id: comment.User_Id,
          name: comment.Username,
          avatar: comment.Avatar
        },
        created_at: new Date().toLocaleString(), // Replace with actual date field if available
        replies: []
      };
    });
  
    // Build nested structure
    const topLevelComments = [];
    const repliesMap = {};
  
    // First pass: separate top-level comments and replies
    Object.values(commentMap).forEach(comment => {
      if (comment.parentCommentId && comment.parentCommentId !== "") {
        repliesMap[comment.parentCommentId] = repliesMap[comment.parentCommentId] || [];
        repliesMap[comment.parentCommentId].push(comment);
      } else {
        topLevelComments.push(comment);
      }
    });
  
    // Second pass: attach replies to their parents
    topLevelComments.forEach(comment => {
      comment.replies = repliesMap[comment.id] || [];
    });
  
    return topLevelComments;
  };