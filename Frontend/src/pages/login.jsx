import { User, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Check if already logged in
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      if (role === "admin") {
        navigate("/admin/home", { replace: true });
      } else {
        navigate("/user/home", { replace: true });
      }
    }
  }, [navigate]);

  // 🔹 Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        username,
        password,
      });

      const data = response.data;
      // console.log(data);

      // ✅ Store in cookies (expires in 1 days)
      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("username", data.user.username, { expires: 1 });
      Cookies.set("role", data.user.role, { expires: 1 });

      // 🔁 Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/home");
      } else {
        navigate("/user/home");
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-4xl font-bold text-sky-500">Welcome</h1>
          <p className="text-gray-500 mt-2 text-sm">Login with Username</p>

          {/* Username */}
          <div className="mt-8">
            <label className="block text-left text-sm text-gray-600 mb-1">
              Username
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <User className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-5">
            <label className="block text-left text-sm text-gray-600 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <Lock className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full mt-6 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg shadow-lg transition duration-300"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
