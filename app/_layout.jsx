import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "./ToastContext";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  return (
    <NavigationContainer>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/Login" />
          <Stack.Screen name="auth/SignUp" />
          <Stack.Screen name="pages/AccountSetup" />
          <Stack.Screen name="pages/ResetPassWord" />
          <Stack.Screen name="pages/Home" />
          <Stack.Screen name="pages/Search" />
          <Stack.Screen name="pages/Community" />
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
