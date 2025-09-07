import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={`border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-amber-200 bg-amber-50'}`}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className={`font-bold text-xl ${isDark ? 'text-white' : 'text-amber-900'}`}>
            My Blog
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-amber-700 hover:bg-amber-100'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            {!user ? (
              <Link to="/login" className={`${isDark ? 'text-gray-300' : 'text-amber-700'}`}>
                Login
              </Link>
            ) : (
              <>
                <Link to="/create-post" className={`${isDark ? 'text-gray-300' : 'text-amber-700'}`}>
                  New Post
                </Link>
                <div className="flex items-center space-x-3">
                  <span className={`${isDark ? 'text-white' : 'text-amber-900'}`}>
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-amber-600'}`}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
