import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AdminUser, LoginResponse } from '../types';
import { safeFetchJson } from '../lib/api';

interface AuthContextType {
  adminToken: string | null;
  adminUser: AdminUser | null;
  loginLoading: boolean;
  loginError: string;
  login: (email: string, password: string) => Promise<AdminUser | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'sallehub_admin_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Validate stored session on mount
  useEffect(() => {
    if (!adminToken) return;
    safeFetchJson<AdminUser>('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then(user => setAdminUser(user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAdminToken(null);
      });
  }, [adminToken]);

  const login = useCallback(async (email: string, password: string): Promise<AdminUser | null> => {
    setLoginLoading(true);
    setLoginError('');

    const endpoints = ['/api/auth/login', '/api/admin/login'];
    let lastError = '';

    try {
      for (const endpoint of endpoints) {
        try {
          const data = await safeFetchJson<LoginResponse>(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          localStorage.setItem(TOKEN_KEY, data.token);
          setAdminToken(data.token);
          const user = data.admin || data.user || null;
          setAdminUser(user);
          return user;
        } catch (err: any) {
          lastError = err.message || 'Login failed';
        }
      }
      throw new Error(lastError);
    } catch (err: any) {
      setLoginError(err.message);
      return null;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAdminToken(null);
    setAdminUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        adminToken,
        adminUser,
        loginLoading,
        loginError,
        login,
        logout,
        isAuthenticated: !!adminToken && !!adminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}