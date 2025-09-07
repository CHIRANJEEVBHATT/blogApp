import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`);

      const postData = response.data;
      
      
      if (user && user._id !== postData.author._id) {
        setError("You are not authorized to edit this post");
        setLoading(false);
        return;
      }
      
      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch post");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        { title: title.trim(), content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/post/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update post");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-64 ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-amber-600'}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <p className={`mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        <button
          onClick={() => navigate("/")}
          className={`px-4 py-2 rounded ${isDark ? 'bg-cyan-600 text-white' : 'bg-amber-600 text-white'}`}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-amber-900'}`}>
          Edit post
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-xl font-bold border-none outline-none bg-transparent ${
                isDark ? 'text-white placeholder-gray-500' : 'text-amber-900 placeholder-amber-400'
              }`}
              placeholder="Post title"
              required
            />
          </div>
          
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className={`w-full border-none outline-none resize-none bg-transparent ${
                isDark ? 'text-gray-300 placeholder-gray-500' : 'text-amber-800 placeholder-amber-400'
              }`}
              placeholder="Write your post here..."
              required
            />
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-300">
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className={`${isDark ? 'text-gray-400' : 'text-amber-600'}`}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className={`px-4 py-2 rounded disabled:opacity-50 ${
                isDark ? 'bg-cyan-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
