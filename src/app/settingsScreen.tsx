import { AppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useContext, useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
  Image,
} from "react-native";
import { darkTheme, lightTheme } from "@/theme";

export default function settingsScreen() {
  const {
    secondsOn,
    setsecondsOn,
    value,
    setValue,
    DarkMode,
    setDarkMode,
    currentStreak,
    setcurrentStreak,
    bestDayTime,
    setBestDayTime,
    longestStreak,
    setlongestStreak,
    isFireActive,
    setisFireActive,
    isInitialized,
    setIsInitialized,
    fetchSecondsShowState,
    isDarkInitialized,
    setIsDarkInitialized,
  } = useContext(AppContext);

  const theme = DarkMode ? darkTheme : lightTheme;

  const triggerHaptic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const timerFinishedVibrate = () => {
    Vibration.vibrate(1000);
    // 2 seconds
    // Vibration.vibrate([3000,500,3000,500,3000]); // 2 seconds
  };
  const confirmAction = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to clear all data in History?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            console.log("Confirmed");
            clearData();
            timerFinishedVibrate();
          },
        },
      ],
    );
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem("timerData");
      await AsyncStorage.removeItem("todayData");
      await AsyncStorage.removeItem("currentStreak");
      await AsyncStorage.removeItem("streakDate");
      await AsyncStorage.removeItem("longestStreak");
      await AsyncStorage.removeItem("bestDayTime");
      await AsyncStorage.removeItem("secondsOn");
      await AsyncStorage.removeItem("darkState");
      await AsyncStorage.removeItem("todayDate");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
    setcurrentStreak(0);
    setBestDayTime(0);
    setlongestStreak(0);
    setisFireActive(false);
    setValue(!value);
  };

  // const fetchSecondsShowState = async () => {
  //   try {
  //     const storedSecondsOn = await AsyncStorage.getItem("secondsOn");
  //     if (storedSecondsOn !== null) {
  //       setsecondsOn(JSON.parse(storedSecondsOn));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching secondsOn state:", error);
  //   }
  //   setIsInitialized(true);
  // };
  // Now use fetchSecondsShowState from AppContext
  const saveSecondShowState = async () => {
    try {
      await AsyncStorage.setItem("secondsOn", JSON.stringify(secondsOn));
    } catch (error) {
      console.error("Error saving secondsOn state:", error);
    }
  };
  const saveDarkState = async () => {
    try {
      await AsyncStorage.setItem("darkState", JSON.stringify(DarkMode));
    } catch (error) {
      console.error("Error saving dark state:", error);
    }
  };

  //saving darkmode state
  useEffect(() => {
    if (isDarkInitialized) {
      saveDarkState();
    }
  }, [DarkMode, isDarkInitialized]);
  

  // saving secondsstate
  useEffect(() => {
    if (isInitialized) {
      saveSecondShowState();
    }
  }, [secondsOn, isInitialized]);

  //  fetching seconds when screen is focused using useFocusEffect
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchSecondsShowState();
  //   }, [fetchSecondsShowState]),
  // );

  const toggleSecondsOn = () => {
    setsecondsOn(true);
  };
  const toggleSecondsOff = () => {
    setsecondsOn(false);
  };

  // darkmode

  const toggleDarkModeOn = () => {
    setDarkMode(true);
  };
  const toggleDarkModeOff = () => {
    setDarkMode(false);
  };

  // darkmode

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}> */}

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            width: "95%",
          }}
        >
          <Pressable
            onPress={() =>
              Linking.openURL("https://buymeacoffee.com/gorai_abhijit_")
            }
            style={{
              backgroundColor: "#FFDD00",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: "100%",
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/bmc-button.png")}
              style={{ width: "100%", height: 40 }}
              resizeMode="contain"
            />
          </Pressable>

          <View
            style={[styles.settingitem, { backgroundColor: theme.cardColor }]}
          >
            <Text style={[{ color: theme.text },styles.label]}>Show Seconds</Text>
            <View style={[styles.button, { borderColor: theme.secondaryText }]}>
              <Pressable
                onPress={() => {
                  toggleSecondsOn();
                  triggerHaptic();
                }}
                style={[
                  styles.switch,
                  { backgroundColor: secondsOn ? "#FF6347" : "transparent" },
                ]}
              >
                <Text style={{ color: theme.text,fontWeight:"bold" }}>ON</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  toggleSecondsOff();
                  triggerHaptic();
                }}
                style={[
                  styles.switch,
                  { backgroundColor: secondsOn ? "transparent" : "#FF6347" },
                ]}
              >
                <Text style={{ color: theme.text,fontWeight:"bold" }}>OFF</Text>
              </Pressable>
            </View>
          </View>

          {/* // this is for darkmode button */}

          <View
            style={[styles.settingitem, { backgroundColor: theme.cardColor }]}
          >
            <Text style={[{ color: theme.text },styles.label]}>Dark Mode</Text>
            <View style={[styles.button, { borderColor: theme.secondaryText }]}>
              <Pressable
                onPress={() => {
                  toggleDarkModeOn();
                  triggerHaptic();
                }}
                style={[
                  styles.switch,
                  { backgroundColor: DarkMode ? "#FF6347" : "transparent" },
                ]}
              >
                <Text style={{ color: theme.text,fontWeight:"bold" }}>ON</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  toggleDarkModeOff();
                  triggerHaptic();
                }}
                style={[
                  styles.switch,
                  { backgroundColor: DarkMode ? "transparent" : "#FF6347" },
                ]}
              >
                <Text style={{ color: theme.text,fontWeight:"bold" }}>OFF</Text>
              </Pressable>
            </View>
          </View>
         

     


          <View
            style={[styles.settingitem, { backgroundColor: theme.cardColor }]}
            >
            <Text style={[{ color: theme.text },styles.label]}>streak update if</Text>
            <Pressable
              onPress={() => {
                alert("custom time currently in development");
              }}
            >
              <Text
                style={[
                  styles.input,
                  { color: theme.text,fontWeight:"bold",borderColor: theme.secondaryText },
                ]}
              >
                
                {">1 hour"}/day
              </Text>
            </Pressable>
          </View>
             

        
        </View>

        <View
          style={[
            styles.resetButtonContainer,
            { backgroundColor: theme.cardColor },
          ]}
        >
          <Pressable onPress={confirmAction}>
            <Text style={{ fontSize: 20, color: theme.text ,fontWeight:"bold"}}>reset stats</Text>
          </Pressable>
        </View>
      </View>

      {/* </SafeAreaView>  */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    padding: 20,
    alignItems: "center",
    flex: 1,
  },
  label:{
    fontWeight:"bold",
    fontSize:18,

  },
  settingitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    width: "100%",
    paddingHorizontal: "7%",
    // paddingVertical: "5%",
    backgroundColor: "white",
    borderRadius: 28,
    height: 95,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 8 },
  },
  input: {
    fontSize: 14,
    height: 40,
    width: 100,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    textAlign: "center",
    verticalAlign: "middle",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 10,
    justifyContent: "center",
    height: 40,
    width: 100,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    //  gap: 10
  },
  switch: {
    height: 45,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 15,
  },
  resetButtonContainer: {
    position: "relative",
    top: 50,
    // bottom: 200,
    backgroundColor: "#ffffff",
    borderColor: "#FF6347",
    borderWidth: 2,
    borderStyle: "dotted",
    padding: 10,
    height: 50,
    width: 120,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    // backgroundColor: "#FF6347",
  },

});
