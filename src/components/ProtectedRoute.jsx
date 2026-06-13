import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const guestMode = localStorage.getItem("guestMode");

  if (!user && !guestMode) {
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
