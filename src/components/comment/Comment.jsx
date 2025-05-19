// components/Comment.jsx
import { useState } from 'react';
import CommentForm from './CommentForm';
import UserAvatar from './UserAvatar';

export default function Comment({ comment, onReply, onDelete, currentUser }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="border-l-4 border-indigo-500 pl-4 pb-2">
      <div className="bg-gray-50 p-3 rounded-md shadow-sm">
        <div className="flex items-start gap-2">
          <UserAvatar user={comment.author} size={8} />
          <div className="flex-1">
            <p className="text-gray-800">{comment.text}</p>
            <small className="text-gray-500 block mt-1">
              {comment.author.name} • {comment.created_at}
            </small>
            
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-indigo-500 text-sm hover:underline"
              >
                {showReplyForm ? "Cancel" : "Reply"}
              </button>
              <button
                onClick={() => onDelete(comment)}
                className="text-indigo-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-6 mt-2">
          <CommentForm
            estimateId={comment.estimateId}
            parentCommentId={comment.id}
            onSubmit={onReply}
            onCancel={() => setShowReplyForm(false)}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-6 mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-white border p-3 rounded-md shadow-sm">
              <div className="flex items-start gap-2">
                <UserAvatar user={reply.author} size={6} />
                <div>
                  <p className="text-gray-800">{reply.text}</p>
                  <small className="text-gray-500">
                    {reply.author.name} • {reply.created_at}
                  </small>
                </div>
                <button
                  onClick={() => onDelete(reply)}
                  className="text-indigo-500 text-sm ml-auto hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}