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

export default function history() {
  //to check if the settings is in focus for ? after the streak
  const isFocused = useIsFocused();
  const { value, setValue } = useContext(AppContext);
  const [Time, setTime] = useState(0);
  const [todayTime, settodayTime] = useState(0);
  const { currentStreak, setCurrentStreak } = useContext(AppContext);
  const { longestStreak, setlongestStreak } = useContext(AppContext);
  const { bestDayTime, setBestDayTime } = useContext(AppContext);

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
      const currentStreak = await AsyncStorage.getItem("currentStreak");
      const longestStreak = await AsyncStorage.getItem("longestStreak");
      if (
        currentStreak !== null &&
        currentStreak !== "undefined" &&
        longestStreak !== null &&
        longestStreak !== "undefined"
      ) {
        const currentStreakNum = JSON.parse(currentStreak);
        const longestStreakNum = JSON.parse(longestStreak);

        if (currentStreakNum > longestStreakNum) {
          try {
            await AsyncStorage.setItem(
              "longestStreak",
              JSON.stringify(currentStreakNum),
            );
            setlongestStreak(currentStreakNum);
          } catch (error) {
            console.error("Error setting longest streak:", error);
          }
        }
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
    <View style={styles.container}>
      <Text style={{ fontSize: 25, fontWeight: "bold", top: 50 }}>
        Progress
      </Text>
      <Settings />
      <View style={styles.box}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "50%",
          }}
        >
          <View>
            <Text style={{ marginBottom: 10 }}>Today</Text>

            <Text style={{ fontSize: 30, textAlign: "center" }}>
              {todayTime < 60
                ? `${todayTime.toString().padStart(2, "0")} s`
                : todayTime >= 3600
                  ? `${Math.floor(todayTime / 3600)}h ${Math.floor((todayTime % 3600) / 60)}m ${(todayTime % 60).toString().padStart(2, "0")}s`
                  : `${Math.floor(todayTime / 60)}m ${(todayTime % 60).toString().padStart(2, "0")}s`}
            </Text>
          </View>
          <View style={{height:"100%",borderWidth:1,borderColor:"black"}}></View>
          <View >
            <Text style={{ marginBottom: 10 }}>Best Day</Text>
            <Text style={{ fontSize: 30, textAlign: "center" }}>
                 {bestDayTime < 60
                ? `${bestDayTime.toString().padStart(2, "0")} s`
                : bestDayTime >= 3600
                  ? `${Math.floor(bestDayTime / 3600)}h ${Math.floor((bestDayTime % 3600) / 60)}m ${(bestDayTime % 60).toString().padStart(2, "0")}s`
                  : `${Math.floor(bestDayTime / 60)}m ${(bestDayTime % 60).toString().padStart(2, "0")}s`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <Text style={{ marginBottom: 10 }}>Life Time</Text>
        <Text style={{ fontSize: 30, textAlign: "center" }}>
          {Time < 60
            ? `${Time.toString().padStart(2, "0")} s`
            : Time >= 3600
              ? `${Math.floor(Time / 3600)}h ${Math.floor((Time % 3600) / 60)}m ${(Time % 60).toString().padStart(2, "0")}s`
              : `${Math.floor(Time / 60)}m ${(Time % 60).toString().padStart(2, "0")}s`}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "90%",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.streakbox}>
          <Text style={{ marginBottom: 10 }}>CurrentStreak</Text>
          <View style={{ top: -50, left: -39, marginBottom: 20 }}>
            <Streak params={isFocused} />
          </View>
        </View>
        <View style={styles.streakbox}>
          <Text style={{ marginBottom: 10 }}>Longest Streak</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={longestStreak > 0 ? activeStreak : inactiveStreak}
              style={{ height: 30, width: 30 }}
            />
            <Text
              style={{ fontSize: 25, textAlign: "center", fontWeight: "bold" }}
            >
              {longestStreak}{" "}
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

    alignItems: "center",
    justifyContent: "center",
  },
});
