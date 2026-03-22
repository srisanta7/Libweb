import React, { createContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const navigate = useNavigate();

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setRole(data.role);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    navigate('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: role === 'ROLE_ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
