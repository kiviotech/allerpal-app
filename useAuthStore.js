import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      jwt: null,
      documentId: null,
      latitude: null, // Add latitude state
      longitude: null, // Add longitude state
      location: null, // Add location state
      login: (userData, token) =>
        set({ user: userData, isAuthenticated: true, jwt: token }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          jwt: null,
          documentId: null,
          latitude: null,
          longitude: null,
          location: null, // Reset location on logout
        }),
      setDocumentId: (id) => set({ documentId: id }),
      setLocation: (lat, lon, loc) => set({ latitude: lat, longitude: lon, location: loc }), // Add method to set location
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
