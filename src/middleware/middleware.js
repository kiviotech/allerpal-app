import { useRouter, useSegments } from "expo-router";
import useAuthStore from "../../useAuthStore";
import { useEffect, useMemo } from "react";
import { BackHandler } from "react-native";

const AuthMiddleware = ({ children }) => {
  const router = useRouter();
  const segments = useSegments(); // Get the current route segments
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);

  // Memoize the route types for better performance
  const routes = useMemo(
    () => ({
      authRoutes: ["auth/Login", "auth/SignUp", "auth/createNewPassword"],
      protectedRoutes: ["pages/Home", "pages/Account", "pages/Profile"],
    }),
    []
  );

  useEffect(() => {
    const enforceAuth = () => {
      const currentRoute = segments.join("/"); // Join segments to get the full route path
      const isAuthRoute = routes.authRoutes.some((route) => currentRoute.startsWith(route));
      const isProtectedRoute = routes.protectedRoutes.some((route) => currentRoute.startsWith(route));

      // Prevent navigation actions before the app is fully mounted
      if (isAuthenticated === undefined) return;

      // Handle unauthenticated users trying to access protected routes
      if (!isAuthenticated && isProtectedRoute) {
        console.warn("Unauthenticated access attempt. Redirecting to Login...");
        router.replace("auth/Login");
        return;
      }

      // Handle authenticated users trying to access auth-only routes
      if (isAuthenticated && isAuthRoute) {
        console.info("Authenticated user attempting to access login/signup. Redirecting to Home...");
        router.replace("pages/Home");
        return;
      }

      // Ensure user-specific data (e.g., userId) is loaded if authenticated
      if (isAuthenticated && !userId) {
        console.log("Authenticated but userId is missing. Fetching user data...");
        // Add logic to fetch user data if necessary
      }
    };

    enforceAuth();
  }, [isAuthenticated, userId, segments, router, routes]);

  useEffect(() => {
    // Prevent the back navigation from going back to the login page once logged in
    const backAction = () => {
      const currentRoute = segments.join("/");
      if (currentRoute === "auth/Login" || currentRoute === "auth/SignUp") {
        // Prevent back navigation from login/signup pages
        return true;
      }
      return false;
    };

    // Attach back handler
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      // Clean up the listener on component unmount
      backHandler.remove();
    };
  }, [segments]);

  // Ensure that children are rendered only after auth checks are completed
  if (isAuthenticated === undefined) {
    // You can return a loading indicator or nothing if the authentication state is not yet resolved
    return null; // Or a loading spinner if necessary
  }

  return children; // Render children if all conditions are met
};

export default AuthMiddleware;
