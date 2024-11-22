import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      jwt: null,
      documentId: null,
      login: (userData, token) =>
        set({ user: userData, isAuthenticated: true, jwt: token }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          jwt: null,
          documentId: null,
        }),
      setDocumentId: (id) => set({ documentId: id }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
