import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${postId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments(prev => [response.data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className={`mt-8 p-4 ${isDark ? 'bg-gray-800' : 'bg-amber-100'} rounded-lg`}>
        <p className={isDark ? 'text-gray-400' : 'text-amber-600'}>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className={`mt-8 p-6 ${isDark ? 'bg-gray-800' : 'bg-amber-100'} rounded-lg`}>
      <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-amber-900'}`}>
        Comments ({comments.length})
      </h3>

      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className={`w-full p-3 rounded border-none outline-none resize-none ${
              isDark 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-white text-amber-900 placeholder-amber-400'
            }`}
            required
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className={`mt-2 px-4 py-2 rounded disabled:opacity-50 ${
              isDark ? 'bg-cyan-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {!user && (
        <div className={`mb-6 p-4 rounded ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
          <p className={isDark ? 'text-gray-400' : 'text-amber-600'}>
            Please login to comment on this post.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className={`p-4 rounded ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${isDark ? 'text-white' : 'text-amber-900'}`}>
                  {comment.author.name}
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {user && user._id === comment.author._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className={`text-sm ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-amber-600 hover:text-red-600'}`}
                >
                  Delete
                </button>
              )}
            </div>
            
            <p className={`${isDark ? 'text-gray-300' : 'text-amber-800'}`}>
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentSection;
