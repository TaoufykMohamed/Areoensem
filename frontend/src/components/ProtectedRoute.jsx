import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Spinner from "./ui/Spinner.jsx";

/**
 * Garde de route : redirige vers /connexion si non authentifié. Avec
 * `roles`, redirige aussi les rôles non autorisés (ex. un chef_cellule
 * qui tente d'atteindre un écran admin-only).
 */
export default function ProtectedRoute({ roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/connexion" state={{ from: location }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
