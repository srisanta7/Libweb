import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ requireAdmin = false }: { requireAdmin?: boolean }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <div className="p-8 text-center text-red-500">Access Denied: Admin privileges required.</div>;
  }

  return <Outlet />;
};
