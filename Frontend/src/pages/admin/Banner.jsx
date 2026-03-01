import { UserCircle, LogOut, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../../../public/assets/Carture_logo.png";
import { useState } from "react";

function AdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const admin = {
    name: Cookies.get("username"),
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    navigate("/", { replace: true });
  };

  const handleCreateUser = () => {
    navigate("/user/create");
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-50 flex justify-between items-center bg-sky-500 px-6 py-3 shadow-md">
        {/* Left - Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Carture_logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Center - Title */}
        <h2 className="text-2xl font-bold text-white tracking-wide">
          ADMIN DASHBOARD
        </h2>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          {/* Create User Button */}
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-sky-100 transition"
          >
            <UserPlus size={18} />
            Create User
          </button>

          {/* Profile Icon */}
          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="bg-sky-400 p-2 rounded-full cursor-pointer hover:bg-sky-300 transition"
            >
              <UserCircle size={22} className="text-white" />
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl p-4 border border-gray-200 z-[100]">
                <p className="text-gray-800 font-semibold text-lg">
                  {admin.name}
                </p>

                <hr className="my-3" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:bg-gray-100 w-full p-2 rounded-lg transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
