import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSuccess = async (credentialResponse) => {
     console.log("Google credential response:", credentialResponse);
    try {
      const token = credentialResponse.credential;
      if (!token) {
        console.error("No token from Google!");
        return;
      }

      const res = await axios.post("http://localhost:4000/auth/google", { token });

      console.log("Backend response:", res.data);
      login(res.data.user, res.data.token);


      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default GoogleLoginButton;
