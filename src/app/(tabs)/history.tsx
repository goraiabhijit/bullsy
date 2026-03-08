import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppProvider, AppContext } from "@/context/AppContext";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Settings from "@/components/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Streak from "@/components/Streak";
import { useIsFocused } from "@react-navigation/native";
import activeStreak from "../../UIassets/streakActive.png";
import inactiveStreak from "../../UIassets/streakInactive.png";
import { Image } from "expo-image";
import {darkTheme, lightTheme} from "@/theme";

export default function history() {
  //to check if the settings is in focus for ? after the streak
  const isFocused = useIsFocused();
  const {
    value,
    setValue,
    currentStreak,
    setCurrentStreak,
    longestStreak,
    setlongestStreak,
    bestDayTime,
    setBestDayTime,
    DarkMode,
    isFireActive,
  } = useContext(AppContext);
  const [Time, setTime] = useState(0);
  const [todayTime, settodayTime] = useState(0);

  const theme = DarkMode ? darkTheme : lightTheme;

  //fetching longest streak from async storage and set it to context only runs once empty dependency
  const fetchlongestStreak = async () => {
    try {
      const longestStreak = await AsyncStorage.getItem("longestStreak");
      if (longestStreak !== null && longestStreak !== "undefined") {
        setlongestStreak(JSON.parse(longestStreak));
      }
    } catch (error) {
      console.error("Error fetching longest streak:", error);
    }
  };
  useEffect(() => {
    fetchlongestStreak();
  }, []);
  //fetchign longest streak end

  //function to set current longest streak based on calculations of current streak if more then longest streak

  const setLongestStreak = async () => {
    try {
      const currentStreakStr = await AsyncStorage.getItem("currentStreak");
      const longestStreakStr = await AsyncStorage.getItem("longestStreak");
      
      if (currentStreakStr === null || currentStreakStr === "undefined") {
        return; // No current streak yet
      }
      
      const currentStreakNum = JSON.parse(currentStreakStr);
      
      // If longestStreak doesn't exist yet, initialize it
      if (longestStreakStr === null || longestStreakStr === "undefined") {
        await AsyncStorage.setItem("longestStreak", JSON.stringify(currentStreakNum));
        setlongestStreak(currentStreakNum);
        return;
      }
      
      const longestStreakNum = JSON.parse(longestStreakStr);

      if (currentStreakNum > longestStreakNum) {
        await AsyncStorage.setItem(
          "longestStreak",
          JSON.stringify(currentStreakNum),
        );
        setlongestStreak(currentStreakNum);
      }
    } catch (error) {
      console.error("Error setting longest streak:", error);
    }
  };
  useEffect(() => {
    setLongestStreak();
  }, [currentStreak]);

  const loadData = async () => {
    const value = await AsyncStorage.getItem("timerData");
    const todayValue = await AsyncStorage.getItem("todayData");
    const bestDayTime = await AsyncStorage.getItem("bestDayTime");

    if (todayValue !== null && todayValue !== "undefined") {
      settodayTime(JSON.parse(todayValue));
    } else {
      settodayTime(0);
    }
    if (value !== null && value !== "undefined") {
      const parsed = JSON.parse(value);
      setTime(parsed.Time);
    } else {
      setTime(0);
    }
    if (bestDayTime !== null && bestDayTime !== "undefined") {
      setBestDayTime(JSON.parse(bestDayTime));
    }
  };

  const resetToday = async () => {
    try {
      const todayDate = await AsyncStorage.getItem("todayDate");
      if (todayDate !== null && todayDate !== "undefined") {
        const date = new Date(todayDate).getDate();
        const today = new Date().getDate();
        if (date !== today) {
          await AsyncStorage.setItem("todayData", JSON.stringify(0));
          settodayTime(0);
        }
      }
    } catch (error) {
      console.error("Error resetting today's time:", error);
    }
  };
  useEffect(() => {
    resetToday();
  }, [isFocused]);

  useEffect(() => {
    loadData();
  }, [value]);

  return (
     <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={{ fontSize: 30, fontWeight: "bold", top: 50, color:theme.text }}>
        Progress
      </Text>
        <View style={{ position: "absolute", top: 0, width: "100%", 
        flexDirection: "row", justifyContent: "flex-end", padding: 30
      }}>
          <Settings />

        </View>
      <View style={[styles.box,{backgroundColor:theme.cardColor}]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ marginBottom: 10 ,color:theme.text }}>Today</Text>

            <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" ,color:theme.text}}>
              {todayTime < 60
                ? `00 m `
                : todayTime >= 3600
                  ? `${Math.floor(todayTime / 3600)}h ${Math.floor((todayTime % 3600) / 60)}m`
                  : `${Math.floor(todayTime / 60)}m`}
            </Text>
      


          </View>
          <View
            style={{ height: "100%", borderWidth: 1, borderColor: theme.text }}
          ></View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ marginBottom: 10,color:theme.text }}>Best Day</Text>
            <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" ,color:theme.text}}>
              {bestDayTime < 60
                ? `00 m`
                : bestDayTime >= 3600
                  ? `${Math.floor(bestDayTime / 3600)}h ${Math.floor((bestDayTime % 3600) / 60)}m`
                  : `${Math.floor(bestDayTime / 60)}m`}
            </Text>
          </View>
        </View>
      </View>

         <View style={[styles.box,{backgroundColor:theme.cardColor}]}>
        <Text style={{ marginBottom: 10 ,color:theme.text}}>Life Time</Text>
        <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" ,color:theme.text }}>
          {Time < 60
            ? `00 m `
            : Time >= 3600
              ? `${Math.floor(Time / 3600)}h ${Math.floor((Time % 3600) / 60)}m`
              : `${Math.floor(Time / 60)}m`}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-between",
        }}
      >
            <View style={[styles.streakbox,{backgroundColor:theme.cardColor}]}>
          <Text style={{ marginBottom: 10 ,color:theme.text}}>CurrentStreak</Text>
          <View style={{  marginBottom: 0}}>
            <Streak params={isFocused} />
          </View>
        </View>
        <View style={[styles.streakbox,{backgroundColor:theme.cardColor}]}>
          <Text style={{ marginBottom: 10 ,color:theme.text}}>Longest Streak</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={longestStreak > 0 ? activeStreak : inactiveStreak}
              style={{ height: 30, width: 30, tintColor: !isFireActive ?  theme.secondaryText:undefined  }}
            />
            <Text
              style={{ fontSize: 32, textAlign: "center", fontWeight: "bold" ,color: theme.text }}
            >
              {longestStreak}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",

    gap: 15,
    // justifyContent: "center",
  },
  box: {
    height: 120,
    width: "90%",
    top: 120,
    backgroundColor: "white",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 20,
   shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 7,
    shadowOffset: { width: 0, height: 8 },


    alignItems: "center",
    justifyContent: "center",
  },
  streakbox: {
    height: 120,
    width: "49%",
    top: 120,
    backgroundColor: "white",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 20,
    shadowColor: "#000",
   shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 7,
    shadowOffset: { width: 0, height: 8 },
    alignItems: "center",
    justifyContent: "center",
  },
});
