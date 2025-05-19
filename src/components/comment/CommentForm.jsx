// components/CommentForm.jsx
import { useState } from 'react';
import MentionInput from './MentionInput';
import { fetchUsers } from './mockUsers';

export default function CommentForm({
  estimateId,
  parentCommentId = null,
  onSubmit,
  onCancel = () => {},
  currentUser
}) {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (!currentUser || !currentUser.id) {
      // Optionally, show an error or prevent submission
      console.log("User info is missing. Please log in again.");
      return;
    }

    const newComment = {
      id: Date.now(),
      estimateId,
      parentCommentId,
      text,
      author: {
        id: currentUser.id, // Current user (mock)
        name: currentUser.full_name,
        avatar: currentUser.image_link
      },
      created_at: new Date().toLocaleString(),
      replies: [],
    };
//console.log(newComment)
    onSubmit(newComment);
    setText("");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <MentionInput value={text} onChange={setText}/>
      
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600"
        >
          {parentCommentId ? "Reply" : "Add Comment"}
        </button>
        {parentCommentId && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}