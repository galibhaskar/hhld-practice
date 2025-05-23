import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authName: "",
  updateAuthName: (username) => set({ authName: username }),
}));
