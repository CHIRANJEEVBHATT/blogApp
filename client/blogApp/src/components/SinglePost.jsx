import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const SinglePost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`);

      setPost(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch post");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-amber-600'}>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <div className="text-center">
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>{error}</p>
          <Link to="/" className={`${isDark ? 'text-cyan-400' : 'text-amber-600'}`}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <div className="text-center">
          <h2 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-amber-900'}`}>
            Post not found
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
            This post doesn't exist.
          </p>
          <Link to="/" className={`${isDark ? 'text-cyan-400' : 'text-amber-600'}`}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && user._id === post.author._id;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <article className={`p-6 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-amber-100 border-amber-200'}`}>
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
                  {post.author?.name || "Unknown"}
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-amber-500'}`}>
                  •
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {isAuthor && (
                <div className="flex space-x-4">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-amber-600'}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`text-sm disabled:opacity-50 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
            
            <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-amber-900'}`}>
              {post.title}
            </h1>
          </header>

          <div className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-amber-800'}`}>
            {post.content}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <div className="flex items-center justify-between mb-6">
              <LikeButton 
                postId={post._id} 
                initialLikes={post.likes || []}
                onLikeUpdate={fetchPost}
              />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
                {post.comments?.length || 0} comments
              </span>
            </div>
          </div>
        </article>

        <CommentSection postId={post._id} />

        <div className="mt-8">
          <Link
            to="/"
            className={`${isDark ? 'text-gray-400' : 'text-amber-600'}`}
          >
            ← Back to posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
