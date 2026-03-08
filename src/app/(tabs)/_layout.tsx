import { AppContext } from "@/context/AppContext";
import { darkTheme, lightTheme } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function TabLayout() {
  const { hideStatusbar, sethideStatusbar, DarkMode } = useContext(AppContext);
  const theme = DarkMode ? darkTheme : lightTheme;

  return (
    <>
      <StatusBar hidden={hideStatusbar} style={DarkMode ? "light" : "dark"} />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: DarkMode ? theme.secondaryText : "black",
          // Change this to your desired color
          //  tabBarStyle: { display: "none" },
          tabBarStyle: {
            backgroundColor: theme.navBar,
            position: "absolute",
            bottom: 40,
            paddingTop: 10,
            // paddingBottom: 10,
            width: "60%",

            marginLeft: "20%",
            // marginRight: "auto",
            // marginBottom: 25,
            borderRadius: 45,
            borderTopWidth: 0.5,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderWidth: 0,
            borderTopColor: DarkMode ? "#334155" : null,
            // borderTopColor:"#a7bfe0",

            height: 75,
            elevation: DarkMode ? 10 : 7, // Android shadow
            shadowColor: "#000", // iOS shadow

            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabel: ({ focused }) => (
              <Text
                style={{ fontSize: 12, fontWeight: "bold", color: theme.text,marginTop: 3 }}
              >
                {focused ? "count-up" : ""}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "stopwatch-sharp" : "stopwatch-outline"}
                size={focused ? 30 : 25}
                color={color}
              />
            ),
            // tabBarLabel: ({ focused }) => (focused ? "countup" : ""),
          }}
        />
        <Tabs.Screen
          name="pomodoro"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{ fontSize: 12, fontWeight: "bold", color: theme.text, marginTop: 3 }}
              >
                {focused ? "pomodoro" : ""}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "timer-sand-full" : "timer-sand"}
                size={focused ? 30 : 25}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={{ fontSize: 12, fontWeight: "bold", color: theme.text, marginTop: 3 }}
              >
                {focused ? "history" : ""}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "history" : "history"}
                size={focused ? 30 : 25}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
