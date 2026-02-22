// src/store/authStore.ts
import { create } from 'zustand';
import { api } from '../lib/api';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('approveflow_token'),
  isAuthenticated: !!localStorage.getItem('approveflow_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // FastAPI OAuth2PasswordBearer requires Form Data (application/x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = response.data.access_token;
      localStorage.setItem('approveflow_token', token);
      
      set({ token, isAuthenticated: true });
      await get().fetchProfile();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data });
    } catch (error) {
      get().logout(); // If fetching profile fails (e.g., token expired), log them out
    }
  },

  logout: () => {
    localStorage.removeItem('approveflow_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));