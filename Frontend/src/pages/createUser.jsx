import { useState } from "react";
import { User, Lock } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage(""); // clear message while typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        `${BACKEND_URL}/api/auth/user/create`,
        {
          username: formData.username,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setIsError(false);
      setMessage(response.data.message);

      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Unauthorized");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-sky-600 mb-6">
          Create New User
        </h2>

        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <User className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <Lock className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Retype Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <Lock className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retype password"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
              >
                <option value="user">👤 User</option>
                <option value="admin">🛡 Admin</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg shadow-md transition duration-300"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
