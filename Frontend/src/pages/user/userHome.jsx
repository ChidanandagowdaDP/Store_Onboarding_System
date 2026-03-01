import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";
import logo from "../../../public/assets/Carture_logo.png";

export default function UserHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const username = Cookies.get("username");
  const role = Cookies.get("role");

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("role");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white fixed w-full shadow-md px-6 py-4 flex justify-between items-center z-50">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Carture_logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Navigation + Profile */}
        <div className="flex items-center gap-6">
          {/* Navigation Buttons */}
          <div className="flex gap-6">
            <Link
              to="create-store"
              className={`px-4 py-2 rounded-lg transition ${
                location.pathname.includes("create-store")
                  ? "bg-sky-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Create Store
            </Link>

            <Link
              to="view-stores"
              className={`px-4 py-2 rounded-lg transition ${
                location.pathname.includes("view-stores")
                  ? "bg-sky-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              View Stores
            </Link>
          </div>

          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition"
            >
              <User size={20} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border p-4 z-50">
                <p className="text-sm font-semibold">
                  User Name: {username.toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Role : {role.toUpperCase()}
                </p>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="pt-[80px] min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
