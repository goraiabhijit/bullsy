import { AppProvider } from "@/context/AppContext";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    NavigationBar.setButtonStyleAsync("dark");
  }, []);
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        <AppProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                // height: 100
                // headerHeight: 00,
                // backgroundColor: "transparent"
              },
              // headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settingsScreen"
              options={{
                title: "Settings",
                headerTitleAlign: "center",
                headerStyle: {
                  backgroundColor: "#f5f5f5",
                  // headerHeight: 100,
                },
                headerTitleStyle: {
                  fontSize: 25,
                },
              }}
            />
          </Stack>
        </AppProvider>
      </SafeAreaView>
    </>
  );
}
