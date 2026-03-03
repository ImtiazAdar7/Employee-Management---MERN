import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";

export default function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Checking authentication...</div>;

  if (!user) return <Navigate to="/login" />;
  if (user.role === "ADMIN") return <Navigate to="/admin" />;
  return <Navigate to="/profile" />;
}
