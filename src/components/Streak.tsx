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
  const [isFireActive, setisFireActive] = useState(false);

  //   function to set current streak

  const setCurrentStreak = async () => {
    const streakDate = new Date().getDate();
    try {
      const storedStreakDate = await AsyncStorage.getItem("streakDate");

      const todaytime = await AsyncStorage.getItem("todayData");
      if (todaytime !== null && todaytime !== "undefined") {
        const todayTimeNum = JSON.parse(todaytime);
        const storedStreakDateNum =
          storedStreakDate !== null ? JSON.parse(storedStreakDate) : null;
        if (todayTimeNum > 3600 && (streakDate-storedStreakDateNum)>0) {
            if((streakDate-storedStreakDateNum)<2){
                // only update streakk if its just the next day and else reset the streak
                const updatedStreak = currentStreak + 1;
                setisFireActive(true);
                setcurrentStreak(updatedStreak);
      
                await AsyncStorage.setItem(
                  "currentStreak",
                  JSON.stringify(updatedStreak),
                );
      
                await AsyncStorage.setItem("streakDate", JSON.stringify(streakDate));

            }
            else{
                // reset streak if more than one day has passed
                setcurrentStreak(0);
                await AsyncStorage.setItem("currentStreak", JSON.stringify(0));
                await AsyncStorage.setItem("streakDate", JSON.stringify(streakDate));
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
    const today = new Date().getDate();
    try {
      const stored = await AsyncStorage.getItem("streakDate");

      if (stored !== null) {
        const parsedData = JSON.parse(stored);

        if (parsedData === today) {
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
  }, [value]);

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
          {isFireActive || params? currentStreak:currentStreak+1}
          {(!isFireActive && !params) ? "?": null }
        </Text>
      </View>
    </View>
  );
};

export default Streak;
