// AuthProvider.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userData?: User) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string, userData?: User) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Log login activity
      const loginLog = {
        userId: userData.id,
        email: userData.email,
        timestamp: new Date().toISOString(),
        type: 'login'
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('loginActivity') || '[]');
      existingLogs.push(loginLog);
      localStorage.setItem('loginActivity', JSON.stringify(existingLogs));
      
      return { success: true };
    }
    return { success: false, error: "Invalid user data" };
  };

  const logout = () => {
    if (user) {
      // Log logout activity
      const logoutLog = {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        type: 'logout'
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('loginActivity') || '[]');
      existingLogs.push(logoutLog);
      localStorage.setItem('loginActivity', JSON.stringify(existingLogs));
    }
    
    setUser(null);
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};