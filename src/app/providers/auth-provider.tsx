/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuth } from '@/lib/auth/hooks/use-auth';
import React, { createContext, ReactNode, useContext } from 'react';

interface IAuthContextType {
  user: ReturnType<typeof useAuth>['user'];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

interface IAuthProviderProps {
  children: ReactNode;
  initialUser?: any;
}

export function AuthProvider({ children, initialUser }: IAuthProviderProps) {
  const auth = useAuth();

  // sync initial user if provided (from server)
  React.useEffect(() => {
    if (initialUser && !auth.user) {
      //HACK: you might want to sync the user here
    }
  }, [initialUser, auth.user]);

  const value = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): IAuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
