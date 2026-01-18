import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Handle null user (not authenticated) or user object
        setUser(data.user ?? null);
      } else if (response.status === 401) {
        // Legacy 401 handling (shouldn't happen with new endpoint, but keep for compatibility)
        setUser(null);
      } else {
        // Other errors (500, 403, etc.) should be logged
        console.warn('Auth check returned non-401 error:', response.status);
        setUser(null);
      }
    } catch (error) {
      // Only log network errors, not expected 401s
      if (!error.message?.includes('401')) {
        console.error('Auth check failed:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setUser(userData);
    await checkAuth(); // Refresh to get full user data including company_id
  };

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  // Role helper functions
  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'super_admin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'super_admin';
  };

  const canAccess = (route) => {
    if (!user) return false;
    
    // Define route permissions
    const routePermissions = {
      '/': ['user', 'admin', 'super_admin'],
      '/analyses': ['user', 'admin', 'super_admin'],
      '/company': ['admin', 'super_admin'],
      '/companies': ['super_admin'],
      '/admin': ['super_admin'],
    };

    const allowedRoles = routePermissions[route];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    refreshUser,
    isAdmin,
    isSuperAdmin,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

