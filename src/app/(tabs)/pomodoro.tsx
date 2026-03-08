import Settings from "@/components/Settings";
import Streak from "@/components/Streak";
import { AppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useContext, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { darkTheme, lightTheme } from "@/theme";

export default function Index() {
  const {
    secondsOn,
    value,
    setValue,
    hideStatusbar,
    sethideStatusbar,
    DarkMode,
  } = useContext(AppContext);

  const [isTimerOn, setIsTimerOn] = useState(false);
  const [Timer, setTimer] = useState(1500);
  const [breakTime, setbreakTime] = useState(300);
  const timerStartRef = useRef<number | null>(null);
  const breakStartRef = useRef<number | null>(null);
  const storedElapsedTimeRef = useRef(0);
  const [isBreakOn, setisBreakOn] = useState(false);
  const [isBreakShow, setisBreakShow] = useState(false);
  const [isTimerShow, setisTimerShow] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showbreakOverlay, setShowbreakOverlay] = useState(false);

  const theme = DarkMode ? darkTheme : lightTheme;

  // testing haptics

  const triggerHaptic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const timerFinishedVibrate = () => {
    // Vibration.vibrate(3000); // 2 seconds
    Vibration.vibrate([0, 3000, 500, 2000, 300, 1000]);
    // alert("current session over!") // 2 seconds
  };

  // testing haptics
  const triggerOverlay = () => {
    setShowOverlay(true);

    setTimeout(() => {
      setShowOverlay(false);
      sethideStatusbar(false);
    }, 5500);
  };

  const triggerBreakOverlay = () => {
    setShowbreakOverlay(true);

    setTimeout(() => {
      setShowbreakOverlay(false);
      sethideStatusbar(false);
    }, 5500);
  };

  useEffect(() => {
    if (isTimerOn || isBreakOn) {
      activateKeepAwakeAsync("timer");
    } else {
      deactivateKeepAwake("timer");
    }
  }, [isTimerOn, isBreakOn]);

  const timePassedRef = useRef(0);

  const saveObject = async () => {
    const data = { Time: timePassedRef.current };
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
            todayvalue = JSON.stringify(
              JSON.parse(todayvalue) + timePassedRef.current,
            );
            await AsyncStorage.setItem("todayData", todayvalue);
          } else {
            todayvalue = JSON.stringify(timePassedRef.current);
            await AsyncStorage.setItem("todayData", todayvalue);
            await AsyncStorage.setItem("todayDate", today.toISOString());
          }
        } else {
          todayvalue = JSON.stringify(timePassedRef.current);
          await AsyncStorage.setItem("todayData", todayvalue);
          await AsyncStorage.setItem("todayDate", today.toISOString());
        }

        if (bestDayTime !== null && bestDayTime !== "undefined") {
          const bestDayTimeNum = JSON.parse(bestDayTime);
          if (todayvalue !== null && todayvalue !== "undefined") {
            const todayValueNum = JSON.parse(todayvalue);
            if (todayValueNum > bestDayTimeNum) {
              await AsyncStorage.setItem(
                "bestDayTime",
                JSON.stringify(todayValueNum),
              );
            }
          } else {
            // First run of the day: compare current session with best
            if (timePassedRef.current > bestDayTimeNum) {
              await AsyncStorage.setItem(
                "bestDayTime",
                JSON.stringify(timePassedRef.current),
              );
            }
          }
        } else if (todayvalue !== null && todayvalue !== "undefined") {
          await AsyncStorage.setItem("bestDayTime", todayvalue);
        } else {
          // First run ever: set bestDayTime to current session
          await AsyncStorage.setItem(
            "bestDayTime",
            JSON.stringify(timePassedRef.current),
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }

      await AsyncStorage.setItem("timerData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data:", error);
    }

    timePassedRef.current = 0;
    setValue(!value);
  };

  const doSkip = () => {
    if (isBreakShow) {
      setisBreakOn(false);
      setisBreakShow(false);
      setisTimerShow(true);
      sethideStatusbar(false);

      setbreakTime(300);
        storedElapsedTimeRef.current=0;
    }
    if (isTimerShow) {
      setIsTimerOn(false);
      sethideStatusbar(false);
      setTimer(1500);
      timePassedRef.current = 0;
      storedElapsedTimeRef.current = 0;
    }
  };

  const buttonPressed = () => {
    if (isTimerShow) {
      if (!isTimerOn) {
        timerStartRef.current = Date.now();

        setIsTimerOn(true);
      } else {
        setIsTimerOn(false);
        timerStartRef.current = null;
        storedElapsedTimeRef.current = timePassedRef.current;
      }
      sethideStatusbar(!hideStatusbar);
    }
    if (isBreakShow) {
      if (!isBreakOn) {
        breakStartRef.current = Date.now();
        setisBreakOn(true);
      } else {
        setisBreakOn(false);
        breakStartRef.current = null;
        storedElapsedTimeRef.current=300-breakTime;
      }
      sethideStatusbar(!hideStatusbar);
    }
  };

  // useeffect for pomodoro 25 minutes timer

  useEffect(() => {
    if (isTimerOn) {
      const timer = setInterval(() => {
        if (timerStartRef.current !== null) {
          const elapsed = Math.floor(
            (Date.now() - timerStartRef.current) / 1000,
          );
          timePassedRef.current =storedElapsedTimeRef.current+ elapsed;
          

      
          //with every pause the timerstartref.current is beign set to null and then its again recalculatign form the start to everypause behaves like a restart need to fix it

          const remaining = 1500 - timePassedRef.current;


          setTimer(remaining > 0 ? remaining : 0);
          if (remaining <= 0) {
            timerFinishedVibrate();
            triggerOverlay();
            clearInterval(timer);
            setisBreakShow(true);
            setisTimerShow(false);
            setIsTimerOn(false);
            setTimer(1500);
            saveObject();
            timerStartRef.current = null;
            storedElapsedTimeRef.current = 0;
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerOn]);

  useEffect(() => {
    if (isBreakOn) {
      const timer = setInterval(() => {
        if (breakStartRef.current !== null) {
          const elapsed = Math.floor(
            (Date.now() - breakStartRef.current) / 1000,
          );

          const remaining = 300 - (storedElapsedTimeRef.current+elapsed);
          setbreakTime(remaining > 0 ? remaining : 0);
          if (remaining <= 0) {
            clearInterval(timer);
            triggerBreakOverlay();
            setisBreakOn(false);
            setisBreakShow(false);
            setisTimerShow(true);
            setbreakTime(300);
            timerFinishedVibrate();
            breakStartRef.current = null;
             storedElapsedTimeRef.current=0;
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBreakOn]);

  // --- Customizable variables for SVG and timer ---
  const OUTER_CIRCLE_SIZE = 400;
  const OUTER_CIRCLE_RADIUS = 150;
  const OUTER_CIRCLE_STROKE = 12;
  const OUTER_CIRCLE_COLOR = "#f96767";
  const OUTER_CIRCLE_OPACITY = 0.2;

  const INNER_CIRCLE_SIZE = 400;
  const INNER_CIRCLE_RADIUS = 150;
  const INNER_CIRCLE_STROKE = 20;
  const INNER_CIRCLE_COLOR_DARK = "#f7797d";
  // const INNER_CIRCLE_COLOR_DARK = "rgba(74,222,128,0.08)";
  const INNER_CIRCLE_COLOR_LIGHT = "#fc6767";
  const INNER_CIRCLE_ROTATION = -90;
  const INNER_CIRCLE_STROKE_CAP = "round";

  const TIMER_TOTAL_SECONDS = 1500; // 25 min
  const BREAK_TOTAL_SECONDS = 300; // 5 min

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {!isTimerOn && (
          <View
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 30,
            }}
          >
            <Streak params={false} />
            <Settings />
          </View>
        )}

        {/* overlay on break over */}

        {showbreakOverlay && (
          <Pressable
            onPress={() => {
              setShowbreakOverlay(false);
              Vibration.cancel();
            }}
            style={[styles.overlay,{backgroundColor:DarkMode?"white":"black"}]}
          >
            <Text style={[styles.overlayText, { color: DarkMode? "black":"white" }]}>
              Break Time Over
            </Text>
          </Pressable>
        )}

        {/* overlay on break over */}

        {/* overlay on timer over */}

        {showOverlay && (
          <Pressable
            onPress={() => {
              setShowOverlay(false);
              Vibration.cancel();
            }}
            style={[styles.overlay,{backgroundColor:DarkMode?"white":"black"}]}
          >
            <Text style={[styles.overlayText, { color: DarkMode? "black":"white" }]}>
              Session Complete
            </Text>
          </Pressable>
        )}
        {/* overlay on timer over */}

        {/* svg circle */}

        {isTimerShow && (
          <View style={styles.circleContainer}>
            <View
              style={{
                position: "absolute",
              }}
            >
              <Svg width={OUTER_CIRCLE_SIZE} height={OUTER_CIRCLE_SIZE}>
                <Circle
                  cx={OUTER_CIRCLE_SIZE / 2}
                  cy={OUTER_CIRCLE_SIZE / 2}
                  r={OUTER_CIRCLE_RADIUS}
                  originX={OUTER_CIRCLE_SIZE / 2}
                  originY={OUTER_CIRCLE_SIZE / 2}
                  stroke={OUTER_CIRCLE_COLOR}
                  opacity={OUTER_CIRCLE_OPACITY}
                  strokeWidth={OUTER_CIRCLE_STROKE}
                  fill="none"
                  rotation={INNER_CIRCLE_ROTATION}
                />
              </Svg>
            </View>

            <View
              style={{
                position: "absolute",
              }}
            >
              <Svg width={INNER_CIRCLE_SIZE} height={INNER_CIRCLE_SIZE}>
                <Circle
                  cx={INNER_CIRCLE_SIZE / 2}
                  cy={INNER_CIRCLE_SIZE / 2}
                  r={INNER_CIRCLE_RADIUS}
                  originX={INNER_CIRCLE_SIZE / 2}
                  originY={INNER_CIRCLE_SIZE / 2}
                  stroke={
                    DarkMode
                      ? INNER_CIRCLE_COLOR_DARK
                      : INNER_CIRCLE_COLOR_LIGHT
                  }
                  strokeWidth={INNER_CIRCLE_STROKE}
                  strokeLinecap={INNER_CIRCLE_STROKE_CAP}
                  fill="none"
                  rotation={INNER_CIRCLE_ROTATION}
                  strokeDasharray={`${Math.PI * 2 * INNER_CIRCLE_RADIUS}`}
                  strokeDashoffset={`${Math.PI * 2 * INNER_CIRCLE_RADIUS - (Math.PI * 2 * INNER_CIRCLE_RADIUS * timePassedRef.current) / TIMER_TOTAL_SECONDS}`}
                />
              </Svg>
            </View>

           
          </View>
        )}
        {/* svg circle */}

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {isTimerShow && (
            <View>
              {!isTimerOn && (
                <Text
                  style={{
                    fontSize: 24,
                    alignSelf: "center",
                    position: "absolute",
                    color: theme.secondaryText,
                    top: -250,
                  }}
                >
                  {Timer < 1500 && isTimerShow
                    ? "Keep Focusing!"
                    : "Start Focus"}
                </Text>
              )}
              {secondsOn && (
                <Text style={[styles.time, { color: theme.text }]}>
                  {Timer < 60
                    ? `${Timer.toString().padStart(2, "0")} `
                    : Timer >= 3600
                      ? `${Math.floor(Timer / 3600)}:${Math.floor(
                          (Timer % 3600) / 60,
                        )
                          .toString()
                          .padStart(
                            2,
                            "0",
                          )}:${(Timer % 60).toString().padStart(2, "0")}`
                      : `${Math.floor(Timer / 60)}:${(Timer % 60).toString().padStart(2, "0")}`}
                </Text>
              )}
              {!secondsOn && (
                <Text style={[styles.time, { color: theme.text }]}>
                  {Timer < 60
                    ? `00`
                    : Timer >= 3600
                      ? `${Math.floor(Timer / 3600)}:${Math.floor(
                          (Timer % 3600) / 60,
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : `${Math.floor(Timer / 60)
                          .toString()
                          .padStart(2, "0")}`}
                </Text>
              )}
            </View>
          )}

          {isBreakShow && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 24,
                  marginBottom: 10,
                  position: "absolute",
                  top: -250,
                  color: theme.secondaryText,
                }}
              >
                Break Time!
              </Text>
              <View>
                {secondsOn && (
                  <Text style={[styles.time,{color:theme.text}]}>
                    {breakTime < 60
                      ? `${breakTime.toString().padStart(2, "0")} `
                      : `${Math.floor(breakTime / 60)}:${(breakTime % 60).toString().padStart(2, "0")}`}
                  </Text>
                )}
                {!secondsOn && (
                <Text style={[styles.time,{color:theme.text}]}>
                    {breakTime < 60
                      ? `00`
                      : `${Math.floor(breakTime / 60)
                          }`}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <View>
            <Pressable
              onPress={() => {
                buttonPressed();
                triggerHaptic();
              }}
              style={[
                isTimerOn || isBreakOn ? styles.pauseButton : styles.button,
                isTimerOn || isBreakOn
                  ? { backgroundColor: theme.primary }
                  : { backgroundColor: theme.onbutton },
              ]}
            >
              <Text style={styles.buttonText}>
                {isTimerOn || isBreakOn ? (
                  <Ionicons name="pause" size={20} color="black" />
                ) : (
                  <Ionicons name="play" size={20} color="black" />
                )}
              </Text>
            </Pressable>
          </View>
          {(isBreakShow || (isTimerShow && Timer < 1500) || isTimerOn) && (
            <View>
              <Pressable
                onPress={() => {
                  doSkip();
                  triggerHaptic();
                }}
                style={[styles.skipButton, { borderColor: theme.primary }]}
              >
                {isBreakShow && <Text style={{ color: theme.text }}>Skip</Text>}
                {(isTimerOn || Timer < 1500) && (
                  <Text style={{ color: theme.text }}>Give Up</Text>
                )}
              </Pressable>
            </View>
          )}
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
  },
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "50%",
    transform: [{ translateY: -28 }],
  },
  overlay: {
    position: "absolute",
    // flex:1,
    width: "100%",
    height: "100%",
    opacity: 0.9,
    
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  overlayText: {
    position: "relative",
    zIndex: 5,
    top: -100,
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    // backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 20,
    height: 100,
    width: 350,
    textAlign: "center",
    textAlignVertical: "center",
  },
  time: {
    fontSize: 80,
    bottom: 30,

    fontWeight: "bold",
    color: "black",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#90EE90",
    width: 80,
    padding: 10,
    borderRadius: 20,
  },
  pauseButton: {
    backgroundColor: "#ff6f6f",
    width: 80,
    padding: 10,
    borderRadius: 20,
  },
  skipButton: {
    //
    borderStyle: "dotted",
    borderColor: "#FF6347",
    borderWidth: 3,
    borderRadius: 20,

    width: 80,
    padding: 10,
    // textAlign:"center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 160,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
});
