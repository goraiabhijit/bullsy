import { useEffect, useState, useContext, useRef } from "react";
import { AppProvider, AppContext } from "@/context/AppContext";
import { Text, View, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Settings from "@/components/Settings";
import Streak from "@/components/Streak";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import {darkTheme, lightTheme} from "@/theme";

export default function Index() {
  // const [Time, setTime] = useState(new Date());

  const {
    secondsOn,
    value,
    setValue,
    hideStatusbar,
    sethideStatusbar,
    DarkMode,
  } = useContext(AppContext);

  const [isTimerOn, setIsTimerOn] = useState(false);
  const [Timer, setTimer] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const [hideStatus, sethideStatus] = useState(false);

const theme = DarkMode ? darkTheme : lightTheme;


  const triggerHaptic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  useEffect(() => {
    if (isTimerOn) {
      activateKeepAwakeAsync("timer");
    } else {
      deactivateKeepAwake("timer");
    }
  }, [isTimerOn]);

  const saveObject = async () => {
    const data = { Time: Timer };
    const today = new Date();

    try {
      try {
        const value = await AsyncStorage.getItem("timerData");
        //todays data
        let todayvalue = await AsyncStorage.getItem("todayData");
        const bestDayTime = await AsyncStorage.getItem("bestDayTime");

        //todays date
        const todayDate = await AsyncStorage.getItem("todayDate");

        if (value !== null && value !== "undefined") {
          const parsed = JSON.parse(value);
          if (parsed.Time) {
            data.Time = parsed.Time + data.Time;
          }
        }

        if (
          todayvalue !== null &&
          todayvalue !== "undefined" &&
          todayDate !== null &&
          todayDate !== "undefined"
        ) {
          if (
            new Date(todayDate).getDate() === today.getDate() &&
            new Date(todayDate).getMonth() === today.getMonth()
          ) {
            todayvalue = JSON.stringify(JSON.parse(todayvalue) + Timer);
            await AsyncStorage.setItem("todayData", todayvalue);
          } else {
            todayvalue = JSON.stringify(Timer);
            await AsyncStorage.setItem("todayData", todayvalue);
            await AsyncStorage.setItem("todayDate", today.toISOString());
          }
        } else {
          todayvalue = JSON.stringify(Timer);
          await AsyncStorage.setItem("todayData", todayvalue);
          await AsyncStorage.setItem("todayDate", today.toISOString());
        }
        if (bestDayTime !== null && bestDayTime !== "undefined") {
          const bestDayTimeNum = JSON.parse(bestDayTime);
          if (todayvalue !== null && todayvalue !== "undefined") {
            const todayValueNum = JSON.parse(todayvalue);
            if (todayValueNum > bestDayTimeNum) {
              await AsyncStorage.setItem("bestDayTime", JSON.stringify(todayValueNum));
            }
          } else {
            // First run of the day: compare current session with best
            if (Timer > bestDayTimeNum) {
              await AsyncStorage.setItem("bestDayTime", JSON.stringify(Timer));
            }
          }
        } else if (todayvalue !== null && todayvalue !== "undefined") {
          await AsyncStorage.setItem("bestDayTime", todayvalue);
        } else {
          // First run ever: set bestDayTime to current session
          await AsyncStorage.setItem("bestDayTime", JSON.stringify(Timer));
        }
        



      } catch (error) {
        console.error("Error loading data:", error);
      }

      await AsyncStorage.setItem("timerData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data:", error);
    }

    setTimer(0);
    setValue(!value);
  };

  const buttonPressed = () => {
    sethideStatusbar(!hideStatusbar);
    if (!isTimerOn) {
      // Start timer: set start time
      startTimeRef.current = Date.now();
      setIsTimerOn(true);
    } else {
      // Stop timer: save and reset
      saveObject();
      setIsTimerOn(false);
      startTimeRef.current = null;
    }
    // alert("Button Pressed")
  };


  useEffect(() => {
    if (isTimerOn) {
      const timer = setInterval(() => {
        if (startTimeRef.current !== null) {
          const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTimer(diff);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerOn]);

  return (
    <>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        {!isTimerOn &&(
        <View style={{ position: "absolute", top: 0, width: "100%", 
        flexDirection: "row", justifyContent: "space-between", padding: 30
        }}>

        <Streak params={false}/>
        <Settings />
        </View>

        )
        
        }
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {!isTimerOn && (
            <Text
              style={{
                fontSize: 24,
                alignSelf: "center",
                position: "absolute",
                top: -250,
                color: theme.secondaryText,
              }}
            >
              {isTimerOn ? "Keep Focusing!" : "Start Focus"}
            </Text>
          )}

          {secondsOn && (
            <Text style={[styles.time, { color: theme.text }]}>
              {Timer < 60
                ? `${Timer.toString().padStart(2, "0")} `
                : Timer >= 3600
                  ? `${Math.floor(Timer / 3600)}:${Math.floor((Timer % 3600) / 60)}:${(Timer % 60).toString().padStart(2, "0")}`
                  : `${Math.floor(Timer / 60)}:${(Timer % 60).toString().padStart(2, "0")}`}
            </Text>
          )}
          {!secondsOn && (
            <Text style={[styles.time, { color: theme.text }]}>
              {Timer < 60
                ? `00`
                : Timer >= 3600
                  ? `${Math.floor(Timer / 3600)}:${Math.floor((Timer % 3600) / 60).toString().padStart(2, "0")}`
                  : `${Math.floor(Timer / 60)}`
                      .toString()
                      .padStart(2, "0")}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              buttonPressed();
              triggerHaptic();
            }}
            style={[isTimerOn ? styles.pauseButton : styles.button , isTimerOn ? {borderColor:theme.text}: {backgroundColor:theme.onbutton}]} >
            <Text style={styles.buttonText}>
              {isTimerOn ? (
                <Text style={{color:theme.text}}>Finish</Text>
              ) : (
                <Ionicons name="play" size={20} color="black" />
              )}
            </Text>
          </Pressable>
        </View>
      </View>
      {/* <StatusBar hidden={isTimerOn} style="dark" /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    

    justifyContent: "center",
    // height:"50%",
  },
  time: {
    left: 12,
    fontSize: 80,
    bottom: 30,
    color: "black",
    fontWeight: "bold",
  },
  button: {
    marginTop: 50,
    width: 80,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#90EE90",
  },
  pauseButton: {
    borderColor: "black",
    borderWidth: 2.5,

    borderStyle: "dotted",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 22,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 160,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
  },
});
