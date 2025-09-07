import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const LikeButton = ({ postId, initialLikes = [], onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes.length);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (user) {
      checkLikeStatus();
    }
  }, [user, postId]);

  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/likes/${postId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (isLiked) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/likes/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/likes/${postId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
        <span>❤️</span>
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center space-x-2 transition-colors ${
        isLiked 
          ? (isDark ? 'text-red-400' : 'text-red-600')
          : (isDark ? 'text-gray-400 hover:text-red-400' : 'text-amber-600 hover:text-red-600')
      }`}
    >
      <span>{isLiked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
