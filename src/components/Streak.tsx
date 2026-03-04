import { AppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import activeStreak from "../UIassets/streakActive.png";
import inactiveStreak from "../UIassets/streakInactive.png";

const Streak = ({ params }: { params: boolean }) => {
  const { currentStreak, setcurrentStreak } = useContext(AppContext);
  const { value, setValue } = useContext(AppContext);
  const { isFireActive, setisFireActive } = useContext(AppContext);

  // Helper to calculate days between two dates
  const getDaysDiff = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000; // ms in a day
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.round((d1.getTime() - d2.getTime()) / oneDay);
  };

  //   function to set current streak

  const setCurrentStreak = async () => {
    const today = new Date();
    try {
      const storedStreakDate = await AsyncStorage.getItem("streakDate");

      const todaytime = await AsyncStorage.getItem("todayData");
      if (todaytime !== null && todaytime !== "undefined") {
        const todayTimeNum = JSON.parse(todaytime);

        // First time - no streak date stored yet
        if (storedStreakDate === null || storedStreakDate === "undefined") {
          if (todayTimeNum > 3) {
            setisFireActive(true);
            setcurrentStreak(1);
            await AsyncStorage.setItem("currentStreak", JSON.stringify(1));
            await AsyncStorage.setItem("streakDate", today.toISOString());
          }
          return;
        }

        // Parse stored date - handle old format (number), raw string, or JSON string
        let storedDate: Date;
        let parsed: any;
        try {
          parsed = JSON.parse(storedStreakDate);
        } catch {
          // Not valid JSON - use raw string directly
          parsed = storedStreakDate;
        }

        if (typeof parsed === "number") {
          // Old format: just day number - migrate to new format
          await AsyncStorage.setItem("streakDate", today.toISOString());
          storedDate = today; // Treat as today to avoid breaking streak
        } else {
          storedDate = new Date(parsed);
        }
        const dayDiff = getDaysDiff(today, storedDate);

        if (todayTimeNum > 3 && dayDiff > 0) {
          if (dayDiff === 1) {
            // only update streak if its just the next day
            const updatedStreak = currentStreak + 1;
            setisFireActive(true);
            setcurrentStreak(updatedStreak);

            await AsyncStorage.setItem(
              "currentStreak",
              JSON.stringify(updatedStreak),
            );

            await AsyncStorage.setItem("streakDate", today.toISOString());
          } else {
            // reset streak if more than one day has passed
            setcurrentStreak(1);
            setisFireActive(false);
            await AsyncStorage.setItem("currentStreak", JSON.stringify(1));
            await AsyncStorage.setItem("streakDate", today.toISOString());
          }
        }
      }
    } catch (error) {
      console.error("Error setting current streak:", error);
    }
  };
  // function to get current streak from async storage and set it to context
  const getCurrentStreak = async () => {
    const streakDate = new Date().getDate();
    try {
      const currentStreak = await AsyncStorage.getItem("currentStreak");
      if (currentStreak !== null && currentStreak !== "undefined") {
        setcurrentStreak(JSON.parse(currentStreak));
      } else {
        setcurrentStreak(0);
      }
    } catch (error) {
      console.error("Error fetching current streak:", error);
    }
  };

  // update the fire icon
  const updatefire = async () => {
    const today = new Date();
    try {
      const stored = await AsyncStorage.getItem("streakDate");

      if (stored !== null && stored !== "undefined") {
        let parsed: any;
        try {
          parsed = JSON.parse(stored);
        } catch {
          // Not valid JSON - use raw string directly
          parsed = stored;
        }

        let storedDate: Date;
        if (typeof parsed === "number") {
          // Old format: just day number - can't accurately compare
          setisFireActive(false);
          return;
        } else {
          storedDate = new Date(parsed);
        }
        const dayDiff = getDaysDiff(today, storedDate);

        if (dayDiff === 0) {
          setisFireActive(true);
        } else {
          setisFireActive(false);
        }
      } else {
        setisFireActive(false);
      }
    } catch (error) {
      console.log("Error checking streak:", error);
    }
  };

  useEffect(() => {
    updatefire();
  }, []);

  useEffect(() => {
    getCurrentStreak();
  }, []);

  useEffect(() => {
    setCurrentStreak();
  }, [value]);

  return (
    <View
      style={{
        position: "absolute",
        top: 50,
        left: 25,
        height: 30,
        width: 30,
        gap: 5,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Image
          source={isFireActive ? activeStreak : inactiveStreak}
          style={{ height: 30, width: 30 }}
        />
        <Text
          style={{
            color: "black",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {isFireActive || params ? currentStreak : currentStreak + 1}
          {!isFireActive && !params ? "?" : null}
        </Text>
      </View>
    </View>
  );
};

export default Streak;
