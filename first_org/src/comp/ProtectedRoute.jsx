
import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

const ProtectedRoute = () => {
  const token = getToken();
  const user = getUser();

  // No login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Not an admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
