import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:4000/posts",
        { title: title.trim(), content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/post/${response.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-amber-900'}`}>
          Write a new post
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-xl font-bold border-none outline-none bg-transparent ${
                isDark ? 'text-white placeholder-gray-500' : 'text-amber-900 placeholder-amber-400'
              }`}
              required
            />
          </div>
          
          <div>
            <textarea
              placeholder="Write your post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className={`w-full border-none outline-none resize-none bg-transparent ${
                isDark ? 'text-gray-300 placeholder-gray-500' : 'text-amber-800 placeholder-amber-400'
              }`}
              required
            />
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-300">
            <button
              type="button"
              onClick={() => window.history.back()}
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
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
