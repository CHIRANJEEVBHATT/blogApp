import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/posts");
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className={isDark ? 'text-gray-400' : 'text-amber-600'}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>{error}</p>
        <button
          onClick={fetchPosts}
          className={`${isDark ? 'text-cyan-400' : 'text-amber-600'}`}
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className={`text-xl mb-2 ${isDark ? 'text-white' : 'text-amber-900'}`}>
          No posts yet
        </h3>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
          Be the first to write something.
        </p>
        <Link
          to="/create-post"
          className={`inline-block px-4 py-2 rounded ${isDark ? 'bg-cyan-600 text-white' : 'bg-amber-600 text-white'}`}
        >
          Write first post
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post._id} className={`p-6 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-amber-100 border-amber-200'}`}>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
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
          </div>
          
          <h2 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-amber-900'}`}>
            <Link to={`/post/${post._id}`} className={`${isDark ? 'hover:text-cyan-400' : 'hover:text-amber-600'}`}>
              {post.title}
            </Link>
          </h2>
          
          <div className={`mb-4 ${isDark ? 'text-gray-300' : 'text-amber-800'}`}>
            <p>
              {post.content.length > 200
                ? `${post.content.substring(0, 200)}...`
                : post.content}
            </p>
          </div>
          
          <Link
            to={`/post/${post._id}`}
            className={`text-sm ${isDark ? 'text-cyan-400' : 'text-amber-600'}`}
          >
            Read more →
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PostsList;
