import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user, requiresVerification } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Check if email verification is needed
      if (requiresVerification || !user.isEmailVerified) {
        toast.success('Please verify your email to continue');
        return { success: true, user, requiresVerification: true };
      }
      
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, user, requiresVerification: false };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user, requiresVerification } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      
      // Show appropriate message
      if (requiresVerification) {
        toast.success('Please check your email for verification code!');
      } else {
        toast.success('Account created successfully!');
      }
      
      return { success: true, user, requiresVerification: requiresVerification || true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Login with token (for OAuth callback)
  const loginWithToken = async (token) => {
    try {
      // Store token first
      localStorage.setItem('token', token);
      
      // Fetch user data
      const response = await api.get('/auth/me');
      const user = response.data.data.user;
      
      setUser(user);
      setIsAuthenticated(true);
      
      // No toast here - AuthCallback shows the message
      return { success: true, user };
    } catch (error) {
      // Clear token if failed
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      
      const message = error.response?.data?.message || 'Authentication failed';
      return { success: false, error: message };
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      loginWithToken,
      register,
      logout,
      updateUser,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
