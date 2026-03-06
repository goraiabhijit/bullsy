import { AppContext } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useContext, useCallback,useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";

export default function settingsScreen() {
  const {
    secondsOn,
    setsecondsOn,
    value,
    setValue,
    Darkmode,
    setDarkmode,
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
    fetchSecondsShowState
  } = useContext(AppContext);

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

  // saving secondsstate
  useEffect(() => {
    if (isInitialized) {
      saveSecondShowState();
    }
  }, [secondsOn, isInitialized]);

  //  fetching seconds when screen is focused using useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchSecondsShowState();
    }, [fetchSecondsShowState])
  );

  const toggleSecondsOn = () => {
    setsecondsOn(true);
  };
  const toggleSecondsOff = () => {
    setsecondsOn(false);
  };

  // darkmode

  const toggleDarkModeOn = () => {
    // setDarkmode(true);
    alert(
      "Dark mode is currently in development and may not work as expected. We appreciate your patience as we work to improve this feature.",
    );
  };
  const toggleDarkModeOff = () => {
    setDarkmode(false);
  };

  // darkmode

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}> */}

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            width: "90%",
          }}
        >
          <Pressable
            onPress={() =>
              Linking.openURL("https://buymeacoffee.com/gorai_abhijit_")
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFDD00",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              gap: 8,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24 }}>☕</Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#000000" }}>
              Buy me a coffee
            </Text>
          </Pressable>

          <View style={styles.settingitem}>
            <Text>SHOW SECONDS</Text>
            <View style={styles.button}>
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
                <Text>ON</Text>
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
                <Text>OFF</Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              borderWidth: 0.5,
              borderColor: "black",
              width: "100%",
              marginTop: 15,
            }}
          ></View>
          <Text style={{ marginBottom: 15 }}>coming soon...</Text>

          {/* // this is for darkmode button */}

          <View style={styles.settingitem}>
            <Text>DARK MODE</Text>
            <View style={styles.button}>
              <Pressable
                onPress={() => {
                  toggleDarkModeOn();
                  triggerHaptic();
                }}
                style={[
                  styles.switch,
                  { backgroundColor: Darkmode ? "#FF6347" : "transparent" },
                ]}
              >
                <Text>ON</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  toggleDarkModeOff();
                  triggerHaptic();
                }}
                style={[
                  styles.switch,
                  { backgroundColor: Darkmode ? "transparent" : "#FF6347" },
                ]}
              >
                <Text>OFF</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.settingitem}>
            <Text>streak update if</Text>
            <Pressable
              onPress={() => {
                alert("custom time currently in development");
              }}
            >
              <Text style={styles.input}> {">1 hour"}/day</Text>
            </Pressable>
          </View>

          {/* dark mode button end */}
        </View>

        <View style={styles.resetButtonContainer}>
          <Pressable onPress={confirmAction}>
            <Text style={{ fontSize: 20 }}>reset stats</Text>
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

    // backgroundColor: "red",
  },
  settingitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    width: "100%",
    paddingHorizontal: "10%",
    paddingVertical: "5%",
    backgroundColor: "white",
    borderRadius: 15,
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
    position: "absolute",

    bottom: 200,
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
