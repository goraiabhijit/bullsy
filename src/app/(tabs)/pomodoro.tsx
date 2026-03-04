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

export default function Index() {
  const { secondsOn } = useContext(AppContext);
  const { value, setValue } = useContext(AppContext);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [Timer, setTimer] = useState(1500);
  const [breakTime, setbreakTime] = useState(300);
  const [isBreakOn, setisBreakOn] = useState(false);
  const [isBreakShow, setisBreakShow] = useState(false);
  const [isTimerShow, setisTimerShow] = useState(true);
  const { hideStatusbar, sethideStatusbar } = useContext(AppContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showbreakOverlay, setShowbreakOverlay] = useState(false);

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
            await AsyncStorage.setItem(
              "todayData",
              todayvalue,
            );
            await AsyncStorage.setItem("todayDate", today.toISOString());
          }
        } else {
          todayvalue = JSON.stringify(timePassedRef.current);
          await AsyncStorage.setItem(
            "todayData",
            todayvalue,
          );
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
    }
    if (isTimerShow) {
      setIsTimerOn(false);
      sethideStatusbar(false);
      setTimer(1500);
      timePassedRef.current = 0;
    }
  };

  const buttonPressed = () => {
    if (isTimerShow) {
      setIsTimerOn(!isTimerOn);
      sethideStatusbar(!hideStatusbar);
    }
    if (isBreakShow) {
      setisBreakOn(!isBreakOn);
      sethideStatusbar(!hideStatusbar);
    }
  };

  // useeffect for pomodoro 25 minutes timer

  useEffect(() => {
    if (isTimerOn) {
      const timer = setInterval(() => {
        setTimer((prev) => {
          if (prev <=0) {
            timerFinishedVibrate();
            triggerOverlay();
            clearInterval(timer);
            setisBreakShow(true);
            setisTimerShow(false);
            // setisBreakOn(true);
            setIsTimerOn(false);
            // sethideStatusbar(!hideStatusbar);
            // setisBreakOn(true);

            saveObject();

            return 1500;
          }
          return prev - 1;
        });

        timePassedRef.current += 1;
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimerOn]);

  useEffect(() => {
    if (isBreakOn) {
      const timer = setInterval(() => {
        setbreakTime((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            // triggerOverlay();
            triggerBreakOverlay();
            setisBreakOn(false);
            setisBreakShow(false);
            setisTimerShow(true);
            timerFinishedVibrate();
            return 300;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBreakOn]);

  return (
    <>
      <View style={styles.container}>
        <Settings />
        <Streak params={false} />

        {/* overlay on break over */}

        {showbreakOverlay && (
          <Pressable
            onPress={() => {
              setShowbreakOverlay(false);
              Vibration.cancel();
            }}
            style={styles.overlay}
          >
            <Text style={styles.overlayText}> Session Complete</Text>
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
            style={styles.overlay}
          >
            <Text style={styles.overlayText}> Session Complete</Text>
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
              <Svg width={300} height={300}>
                <Circle
                  cx="150"
                  cy="150"
                  r="130"
                  originX={150}
                  originY={150}
                  stroke="#ff6f6f"
                  opacity={0.2}
                  strokeWidth="10"
                  fill="none"
                  rotation="-90"
                />
              </Svg>
            </View>

            <View
              style={{
                position: "absolute",
              }}
            >
              <Svg width={300} height={300}>
                <Circle
                  cx="150"
                  cy="150"
                  r="130"
                  originX={150}
                  originY={150}
                  stroke="#ff6f6f"
                  strokeWidth="15"
                  strokeLinecap="round"
                  fill="none"
                  rotation="-90"
                  strokeDasharray={`${Math.PI * 2 * 130}`}
                  strokeDashoffset={`${Math.PI * 2 * 130 - (Math.PI * 2 * 130 * timePassedRef.current) / 1500}`}
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
                    top: -250,
                  }}
                >
                  {Timer < 1500 && isTimerShow
                    ? "Keep Focusing!"
                    : "Start Focus"}
                </Text>
              )}
              {secondsOn && (
                <Text style={styles.time}>
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
                <Text style={styles.time}>
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
                }}
              >
                Break Time!
              </Text>
              <View>
                {secondsOn && (
                  <Text style={styles.time}>
                    {breakTime < 60
                      ? `${breakTime.toString().padStart(2, "0")} `
                      : `${Math.floor(breakTime / 60)}:${(breakTime % 60).toString().padStart(2, "0")}`}
                  </Text>
                )}
                {!secondsOn && (
                  <Text style={styles.time}>
                    {breakTime < 60
                      ? `00`
                      : `${Math.floor(breakTime / 60)
                          .toString()
                          .padStart(2, "0")}`}
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
                style={styles.skipButton}
              >
                {isBreakShow && <Text>Skip</Text>}
                {(isTimerOn || Timer < 1500) && <Text>Give Up</Text>}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  overlayText: {
    position: "relative",
    top: -50,
    fontSize: 32,
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
    fontSize: 70,
    bottom: 30,
    // fontWeight: "bold",
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
