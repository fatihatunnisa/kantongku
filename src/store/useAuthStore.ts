import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (profile) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
