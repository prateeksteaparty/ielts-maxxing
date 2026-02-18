import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/signin" />;
};

export default ProtectedRoute;
