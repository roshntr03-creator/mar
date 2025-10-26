/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'aiMarketingSuite_isAuthenticated';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return storedAuth === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated.toString());
    } catch (e) {
      console.error('Could not save auth state to local storage', e);
    }
  }, [isAuthenticated]);

  const login = async (email: string, pass: string) => {
    // Mock login logic. In a real app, this would be an API call.
    console.log(`Attempting login with email: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request
    if (email && pass) {
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, pass: string) => {
     // Mock signup logic. In a real app, this would be an API call.
     console.log(`Attempting signup for ${firstName} ${lastName} with email: ${email}`);
     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request
     if (email && pass && firstName && lastName) {
       setIsAuthenticated(true);
     } else {
       throw new Error('Invalid signup details');
     }
  };


  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
