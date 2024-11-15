import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  jwt: null,
  documentId: null,
  login: (userData, token) =>
    set({ user: userData, isAuthenticated: true, jwt: token }),
  logout: () =>
    set({ user: null, isAuthenticated: false, jwt: null, documentId: null }),
  setDocumentId: (id) => set({ documentId: id }),
}));

export default useAuthStore;
