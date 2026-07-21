import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user, token) => set({ user, token, isAuthenticated: !!token }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false })
}));

export { useAuthStore };
