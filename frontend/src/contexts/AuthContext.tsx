import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, email?: string) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user profile
      axios.get('/api/auth/profile')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });

      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user state
      setUser(userData);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed');
    }
  };

  const register = async (username: string, password: string, email?: string): Promise<void> => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        password,
        email,
      });

      const { token, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user state
      setUser(userData);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
