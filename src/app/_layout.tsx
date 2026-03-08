import { AppContext, AppProvider } from "@/context/AppContext";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkTheme, lightTheme } from "@/theme";

export default function RootLayout() {
  return (
    <AppProvider>
      <InnerLayout />
    </AppProvider>
  );
}

function InnerLayout() {
  const { DarkMode } = useContext(AppContext);
  const theme = DarkMode ? darkTheme : lightTheme;
  useEffect(() => {
    NavigationBar.setButtonStyleAsync(DarkMode ? "light" : "dark");
  }, [DarkMode]);
  return (
    <>
      <StatusBar style={DarkMode ? "light" : "dark"} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.background,
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
          
            }}
          />
          <Stack.Screen
            name="settingsScreen"
            options={{
              title: "Settings",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontSize: 30,
              },
              headerTintColor: theme.text,
            }}
          />
        </Stack>
      </SafeAreaView>
    </>
  );
}
