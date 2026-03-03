import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { AppProvider, AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { hide } from "expo-router/build/utils/splash";

export default function TabLayout() {
  const { hideStatusbar, sethideStatusbar } = useContext(AppContext);
  return (
    <>
      <StatusBar hidden={hideStatusbar} style="dark" />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ff6f6f",
          tabBarInactiveTintColor: "black",
          // Change this to your desired color
          //  tabBarStyle: { display: "none" },
          tabBarStyle: {
            backgroundColor: "#e9e9e9",

            position: "absolute",
            bottom: 40,

            paddingTop: 7,
            paddingBottom: 10,

            width: "60%",
            marginLeft: "20%",
            // marginRight: "25%",
            borderRadius: 35,
        // border:none,
        borderTopWidth: 0,
        borderWidth: 0,
            height: 70,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            // title: "Home",
            tabBarLabel: ({ focused }) => (
              <Text style={{ fontSize: 11, fontWeight: "bold" }}>
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
              <Text style={{ fontSize: 11, fontWeight: "bold" }}>
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
              <Text style={{ fontSize: 11, fontWeight: "bold" }}>
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
