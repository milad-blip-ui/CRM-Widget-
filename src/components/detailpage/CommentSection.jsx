// components/CommentSection.jsx
import { useState, useEffect } from "react";
import Comment from "../comment/Comment";
import CommentForm from "../comment/CommentForm";
import { formatComments } from "../../utils/commentUtils";
import { data } from "autoprefixer";

export default function CommentSection({ estimateId, apiComments = [], currentUser}) {
  const [comments, setComments] = useState([]);

  // Transform API data on load
  useEffect(() => {
    if (apiComments.length > 0) {
      const formatted = formatComments(apiComments);
      setComments(formatted);
    }
  }, [apiComments]);

  const addComment = async (newComment) => {
   const payload = {
      Module:"Salesorder",
      Record_Id:newComment.estimateId,
      Parent_Comment_Id:newComment.parentCommentId,
      Body:newComment.text,
      User_Id:newComment.author.id,
      Username:newComment.author.name,
      Avatar:newComment.author.avatar
  }
  const connection = "crmwidgetconnection";
  // Make API call to Zoho Creator
  const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
    parameters:{
      data:{
        ...payload
      }
    },
    method: "POST",
    url: "https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/form/Comments",
    param_type: 2,
  })
  
  if(response.details.statusMessage.code === 3000){
    console.log("comment created", response.details.statusMessage);
    const commentId = response?.details?.statusMessage?.data?.ID;
    console.log(commentId)
    newComment.id  = commentId;
    setComments((prev) => {
      if (newComment.parentCommentId) {
        return prev.map((comment) => {
          if (comment.id === newComment.parentCommentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          }
          return comment;
        });
      }
      return [...prev, newComment];
    });
  }  

  // setComments((prev) => {
  //   if (newComment.parentCommentId) {
  //     return prev.map((comment) => {
  //       if (comment.id === newComment.parentCommentId) {
  //         return {
  //           ...comment,
  //           replies: [...comment.replies, newComment],
  //         };
  //       }
  //       //console.log(comment)
  //       return comment;
  //     });
  //   }
  //   return [...prev, newComment];
  // });
  };
  const deleteCommentAndReplies = async (comment, estimateId) => {
    // First, delete all replies recursively
    if (comment.replies && comment.replies.length > 0) {
      for (const reply of comment.replies) {
        await deleteCommentAndReplies(reply, estimateId);
      }
    }
  
    // Then, delete the current comment
    try {
      const connection = "crmwidgetconnection";
      const response = await window.ZOHO.CRM.CONNECTION.invoke(connection, {
        method: "DELETE",
        url: `https://www.zohoapis.com/creator/v2.1/data/sst1source/source-erp/report/All_Comments/${comment.id}`,
        param_type: 1,
      });
  
      console.log(`Deleted comment ID: ${comment.id}`, response);
    } catch (error) {
      console.error(`Failed to delete comment ID: ${comment.id}`, error);
    }
  };
  const handleDelete = async(commentToDelete) => {

    await deleteCommentAndReplies(commentToDelete, commentToDelete.estimateId);
    setComments((prevComments) => {
      const deleteCommentRecursively = (comments) => {
        return comments
          .filter((comment) => comment.id !== commentToDelete.id)
          .map((comment) => ({
            ...comment,
            replies: deleteCommentRecursively(comment.replies),
          }));
      };
      return deleteCommentRecursively(prevComments);
    });
  };
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment 
          key={comment.id} 
          comment={comment} 
          onReply={addComment} 
          onDelete={handleDelete}
          currentUser={currentUser}
          />
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}

      <CommentForm estimateId={estimateId} onSubmit={addComment} currentUser={currentUser}/>
    </div>
  );
}