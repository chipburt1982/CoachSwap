import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user, token) => set({ user, token, isAuthenticated: !!token }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false })
}));

const useDuesStore = create((set) => ({
  duesStatus: null,
  paymentHistory: [],
  isUpToDate: false,
  dueAmount: 0,
  setDuesStatus: (status) => set({ duesStatus: status }),
  setPaymentHistory: (history) => set({ paymentHistory: history }),
  setIsUpToDate: (isUpToDate) => set({ isUpToDate }),
  setDueAmount: (amount) => set({ dueAmount: amount })
}));

const useListingStore = create((set) => ({
  listings: [],
  loading: false,
  setListings: (listings) => set({ listings }),
  setLoading: (loading) => set({ loading })
}));

export { useAuthStore, useDuesStore, useListingStore };
