import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStorageData, setStorageData, removeStorageData } from '../utils/storage';
import authService from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'customer' veya 'business'
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Uygulama açılışında oturum kontrolü
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedToken = await getStorageData('token');
      const userData = await getStorageData('user');
      const role = await getStorageData('userRole');

      if (savedToken && userData && role) {
        setToken(savedToken);
        setUser(userData);
        setUserRole(role);

        // Token geçerli mi kontrol et (opsiyonel - profil çekerek)
        try {
          const profileData = await authService.getProfile();
          if (profileData.user) {
            setUser(profileData.user);
            await setStorageData('user', profileData.user);
          }
        } catch (error) {
          // Token geçersizse temizle
          console.log('Token geçersiz, temizleniyor...');
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // Auth verilerini temizle
  const clearAuthData = async () => {
    await removeStorageData('token');
    await removeStorageData('user');
    await removeStorageData('userRole');
    setToken(null);
    setUser(null);
    setUserRole(null);
  };

  // Giriş fonksiyonu
  const login = async (email, password, role) => {
    try {
      const response = await authService.login({
        email,
        password,
        role,
      });

      if (response.user && response.token) {
        // Token ve user bilgilerini kaydet
        await setStorageData('token', response.token);
        await setStorageData('user', response.user);
        await setStorageData('userRole', response.user.role);

        setToken(response.token);
        setUser(response.user);
        setUserRole(response.user.role);

        return { success: true };
      }

      return { success: false, error: 'Giriş başarısız' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Giriş sırasında bir hata oluştu'
      };
    }
  };

  // Kayıt fonksiyonu
  const register = async (email, password, name, role, phone, businessName) => {
    try {
      const response = await authService.register({
        email,
        password,
        name,
        role,
        phone,
        businessName,
      });

      if (response.user && response.token) {
        // Token ve user bilgilerini kaydet
        await setStorageData('token', response.token);
        await setStorageData('user', response.user);
        await setStorageData('userRole', response.user.role);

        setToken(response.token);
        setUser(response.user);
        setUserRole(response.user.role);

        return { success: true };
      }

      return { success: false, error: 'Kayıt başarısız' };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Kayıt sırasında bir hata oluştu'
      };
    }
  };

  // Çıkış fonksiyonu
  const logout = async () => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Profil güncelleme
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);

      if (response.user) {
        setUser(response.user);
        await setStorageData('user', response.user);
        return { success: true };
      }

      return { success: false, error: 'Profil güncellenemedi' };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Profil güncellenirken bir hata oluştu'
      };
    }
  };

  const value = {
    user,
    userRole,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
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
