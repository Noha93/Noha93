import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserRole, Doctor } from '../types';
import { MOCK_USER, MOCK_DOCTORS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  doctor: Doctor | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsUser: (email: string, password: string) => Promise<boolean>;
  loginAsDoctor: (email: string, password: string) => Promise<boolean>;
  registerUser: (data: Partial<UserProfile>) => Promise<boolean>;
  registerDoctor: (data: Partial<Doctor>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateDoctorStatus: (status: 'open' | 'closed' | 'busy') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = '@clinic_dir_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const session = await AsyncStorage.getItem(AUTH_KEY);
      if (session) {
        const { userRole, userId } = JSON.parse(session);
        if (userRole === 'user') {
          setUser(MOCK_USER);
          setRole('user');
        } else if (userRole === 'doctor') {
          const doc = MOCK_DOCTORS.find(d => d.id === userId) || MOCK_DOCTORS[0];
          setDoctor(doc);
          setRole('doctor');
        }
      }
    } catch (e) {
      // No session
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsUser = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email/password
    try {
      const mockUser = { ...MOCK_USER, email };
      setUser(mockUser);
      setRole('user');
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ userRole: 'user', userId: MOCK_USER.id }));
      return true;
    } catch {
      return false;
    }
  };

  const loginAsDoctor = async (email: string, password: string): Promise<boolean> => {
    try {
      const doc = MOCK_DOCTORS[0]; // Use first doctor as demo
      setDoctor(doc);
      setRole('doctor');
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ userRole: 'doctor', userId: doc.id }));
      return true;
    } catch {
      return false;
    }
  };

  const registerUser = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      const newUser: UserProfile = {
        ...MOCK_USER,
        ...data,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        favoriteDoctor: [],
        appointments: [],
      };
      setUser(newUser);
      setRole('user');
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ userRole: 'user', userId: newUser.id }));
      return true;
    } catch {
      return false;
    }
  };

  const registerDoctor = async (data: Partial<Doctor>): Promise<boolean> => {
    try {
      const newDoctor: Doctor = {
        ...MOCK_DOCTORS[0],
        ...data,
        id: `doc_${Date.now()}`,
        isSubscribed: false,
        subscriptionPlan: 'free',
        joinedDate: new Date().toISOString(),
      };
      setDoctor(newDoctor);
      setRole('doctor');
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ userRole: 'doctor', userId: newDoctor.id }));
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
    setDoctor(null);
    setRole(null);
  };

  const updateDoctorStatus = (status: 'open' | 'closed' | 'busy') => {
    if (doctor) {
      setDoctor({ ...doctor, clinicStatus: status });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        doctor,
        role,
        isAuthenticated: !!(user || doctor),
        isLoading,
        loginAsUser,
        loginAsDoctor,
        registerUser,
        registerDoctor,
        logout,
        updateDoctorStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
