import GoogleLoginButton from "../components/GoogleLoginButton";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-amber-50'}`}>
      <div className="text-center">
        <h1 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-amber-900'}`}>
          Login
        </h1>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-amber-600'}`}>
          Sign in to start writing
        </p>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default Login;
