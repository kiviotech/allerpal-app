// src/store.js
// import create from 'zustand';

// import { create } from "zustand";

// const useAuthStore = create((set) => ({
//   user: null,  // Stores the user data (null initially)
//   isAuthenticated: false,  // Tracks if the user is logged in
//   login: (userData) => set({ user: userData, isAuthenticated: true }),
//   logout: () => set({ user: null, isAuthenticated: false }),
// }));

// export default useAuthStore;

import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null, // Stores the user data (null initially)
  isAuthenticated: false, // Tracks if the user is logged in
  jwt: null, // Stores the JWT token
  login: (userData, token) =>
    set({ user: userData, isAuthenticated: true, jwt: token }),
  logout: () => set({ user: null, isAuthenticated: false, jwt: null }),
}));

export default useAuthStore;
