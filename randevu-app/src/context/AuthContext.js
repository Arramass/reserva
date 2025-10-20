import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStorageData, setStorageData, removeStorageData } from '../utils/storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'customer' veya 'business'
  const [loading, setLoading] = useState(true);

  // Uygulama açılışında oturum kontrolü
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getStorageData('user');
      const role = await getStorageData('userRole');

      if (userData && role) {
        setUser(userData);
        setUserRole(role);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Giriş fonksiyonu
  const login = async (email, password, role) => {
    try {
      // TODO: Gerçek API çağrısı burada yapılacak
      // Şimdilik mock data
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        role: role,
      };

      await setStorageData('user', mockUser);
      await setStorageData('userRole', role);

      setUser(mockUser);
      setUserRole(role);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Kayıt fonksiyonu
  const register = async (email, password, name, role) => {
    try {
      // TODO: Gerçek API çağrısı burada yapılacak
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role,
      };

      await setStorageData('user', mockUser);
      await setStorageData('userRole', role);

      setUser(mockUser);
      setUserRole(role);

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  // Çıkış fonksiyonu
  const logout = async () => {
    try {
      await removeStorageData('user');
      await removeStorageData('userRole');
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    userRole,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
