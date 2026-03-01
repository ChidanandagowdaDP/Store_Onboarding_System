import React from "react";
import { Outlet } from "react-router-dom";
import Banner from "./Banner";
import AdminNavbar from "../../components/admin/adminNavbar";

const AdminHome = () => {
  return (
    <div className="bg-gray-100">
      {/* 🔹 Fixed Header Section */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-100">
        <Banner />
        <AdminNavbar />
      </div>

      {/* 🔹 Content Section */}
      <div className="pt-29 px-2 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminHome;
