import api from './api';

export const login = async (credentials: any) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
