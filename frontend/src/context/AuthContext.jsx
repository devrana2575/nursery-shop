import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { tokenStore } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!tokenStore.get()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        if (active) setUser(data.user);
      } catch {
        tokenStore.clear();
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('nursery:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('nursery:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    tokenStore.set(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    tokenStore.set(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
