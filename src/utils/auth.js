// import { useAuthStore } from "../../useAuthStore";
// import apiClient from "../api/apiClient";
// import { deleteToken, saveToken, saveUserId } from "./storage";

// // Login function
// export const login = async (email, password) => {
//   try {
//     const response = await apiClient.post("/auth/local", {
//       identifier: email,
//       password: password,
//     });

     

//     // Extract JWT and user data from the response
//     const { jwt, user } = response.data;

//     console.log("auth.js", jwt, response.data);

//     // Save the JWT and user ID to secure storage
//     saveToken(jwt);
//     saveUserId(user.id);
//     return response.data;
//     // Update Zustand store with JWT and user data
//     //useAuthStore.getState().setAuthData(jwt, user);

   
//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// };

// // Signup function
// export const signup = async (username, email, password) => {
//   try {
//     const response = await apiClient.post("/auth/local/register", {
//       username,
//       email,
//       password,
//     });

    

//     // Return the response data
//     return response.data;
//   } catch (error) {
//     console.error("Signup error:", error);
//     throw error;
//   }
// };

// // Logout function
// export const logout = () => {
//   deleteToken(); // Remove the JWT token from storage
// };



// import { useAuthStore } from "../../useAuthStore"; // Import Zustand store
import apiClient from "../api/apiClient";
import { deleteToken, saveToken, saveUserId } from "./storage";
import useAuthStore from './../../useAuthStore';

// Login function
export const login = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });

    const { jwt, user } = response.data;

    // Save the JWT and user ID to secure storage
    saveToken(jwt);
    saveUserId(user.id);

    // Update Zustand store with JWT and user data
    useAuthStore.getState().login(user, jwt);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Signup function
export const signup = async (username, email, password) => {
  try {
    const response = await apiClient.post("/auth/local/register", {
      username,
      email,
      password,
    });

    const { jwt, user } = response.data;

    // Save the JWT and user ID to secure storage
    saveToken(jwt);
    saveUserId(user.id);

    // Update Zustand store with JWT and user data
    useAuthStore.getState().login(user, jwt);

    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const changePassword = async (currentPassword, password, passwordConfirmation) => {
  try {
    const response = await apiClient.post("/auth/change-password", {
      currentPassword,
      password,
      passwordConfirmation,
    });

    // Log and return the response to notify the user
    console.log("Change password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Change password error:", error.response?.data || error.message);
    throw error;
  }
};


export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", {
      email,
    });

    // Handle the response and notify the user
    console.log("Forgot password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await apiClient.post("/auth/reset-password", 
      {
        "password": data.password,
        "passwordConfirmation": data.passwordConfirm,
        "code": data.code
      }
    );

    // Handle the response and notify the user
    console.log("Forgot password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  deleteToken(); // Remove the JWT token from storage
  useAuthStore.getState().logout(); // Clear the Zustand store
};
