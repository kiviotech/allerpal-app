import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer, useNavigationState } from "@react-navigation/native";
import { ToastProvider } from "./ToastContext";
import useAuthStore from "../useAuthStore";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // Get the current route name
        const currentRoute = state.routes[state.index]?.name;

        // If the user is not authenticated and tries to access the Account page, redirect them
        if (!isAuthenticated && currentRoute === "pages/Account") {
          const navigation = state.routes[0].params?.navigation;
          if (navigation) {
            navigation.replace("auth/Login");
          }
        }
      }}
    >
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/Login" />
          <Stack.Screen name="auth/SignUp" />
          <Stack.Screen name="auth/createNewPassword" />
          <Stack.Screen name="auth/passwordChangedNotification" />
          <Stack.Screen name="pages/AccountSetup" />
          <Stack.Screen name="pages/ResetPassWord" />
          <Stack.Screen name="pages/ChangePassword" />
          <Stack.Screen name="pages/Home" />
          <Stack.Screen name="pages/Search" />
          <Stack.Screen name="pages/Community" />
          <Stack.Screen name="pages/Blog" />
          <Stack.Screen name="pages/BlogDetails" />
          <Stack.Screen name="pages/Chat" />
          <Stack.Screen name="pages/Account" />
          <Stack.Screen name="pages/Profile" />
          <Stack.Screen name="pages/RestaurantScreen" />
          <Stack.Screen name="pages/ReviewForm" />
          <Stack.Screen name="pages/Disclamier" />
          <Stack.Screen name="pages/FinishSetup" />
        </Stack>
      </ToastProvider>
    </NavigationContainer>
  );
};

export default Layout;
