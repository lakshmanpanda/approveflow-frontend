// src/components/layout/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute() {
  const { isAuthenticated, user, fetchProfile } = useAuthStore();

  useEffect(() => {
    // If we have a token but no user profile yet, fetch it!
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Outlet renders the child routes (like the Dashboard) if authenticated
  return <Outlet />;
}