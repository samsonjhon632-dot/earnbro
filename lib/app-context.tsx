import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, DashboardStats } from './types';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  stats: DashboardStats | null;
  setUser: (user: User | null) => void;
  updateBalance: (amount: number) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Create default test user
          const testUser: User = {
            id: 'user_123',
            email: 'rider@earnbro.com',
            name: 'Rider Title',
            balance: 4167,
            totalEarned: 12450,
            createdAt: new Date(),
          };
          setUser(testUser);
          await AsyncStorage.setItem('user', JSON.stringify(testUser));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSetUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      } catch (error) {
        console.error('Failed to save user:', error);
      }
    } else {
      try {
        await AsyncStorage.removeItem('user');
      } catch (error) {
        console.error('Failed to remove user:', error);
      }
    }
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: user.balance + amount,
        totalEarned: user.totalEarned + (amount > 0 ? amount : 0),
      };
      handleSetUser(updatedUser);
    }
  };

  const logout = async () => {
    await handleSetUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        stats,
        setUser: handleSetUser,
        updateBalance,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
