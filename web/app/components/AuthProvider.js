'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Real Login Function
  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Optionally verify token with /auth/me
        try {
          const data = await api.get('/auth/me');
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        } catch (err) {
          console.error('Session expired');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
