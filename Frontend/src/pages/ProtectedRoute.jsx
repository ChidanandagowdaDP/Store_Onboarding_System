import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children, role }) {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If role doesn't match → redirect to login
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access
  return children;
}
