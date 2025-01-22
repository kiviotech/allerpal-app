import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      jwt: null,
      documentId: null,
      profileId: null,
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
          profileId: null,
          latitude: null, // Reset latitude on logout
          longitude: null, // Reset longitude on logout
          location: null, // Reset location on logout
        }),
      setDocumentId: (id) => set({ documentId: id }),
      setProfileId: (id) => set({ profileId: id }),
      setLocation: (lat, lon, loc) =>
        set({ latitude: lat, longitude: lon, location: loc }), // Add method to set location
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
