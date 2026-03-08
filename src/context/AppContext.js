import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState,useEffect } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [value, setValue] = useState(false); // your single state
  const [secondsOn, setsecondsOn] = useState(true);

  const [DarkMode, setDarkMode] = useState(true);
  const [hideStatusbar, sethideStatusbar] = useState(false);
  const [currentStreak, setcurrentStreak] = useState(0);
  //for longest streak displaying in history
  const [longestStreak, setlongestStreak] = useState(0);
  const [bestDayTime, setBestDayTime] = useState(0);
  const [isFireActive, setisFireActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDarkInitialized, setIsDarkInitialized] = useState(false)

  // Move fetchSecondsShowState here
  const fetchSecondsShowState = async () => {
    try {
      const storedSecondsOn = await AsyncStorage.getItem("secondsOn");
      if (storedSecondsOn !== null) {
        setsecondsOn(JSON.parse(storedSecondsOn));
      }
    } catch (error) {
      console.error("Error fetching secondsOn state:", error);
    }
    setIsInitialized(true);
  };

  const fetchDarkState = async () => {
    try {
      const storedDark = await AsyncStorage.getItem("darkState");
      if (storedDark !== null) {
        setDarkMode(JSON.parse(storedDark));
      }
    } catch (error) {
      console.error("Error fetching dark state:", error);
    }
    setIsDarkInitialized(true);
  };

  useEffect(() => {
    fetchSecondsShowState();
    fetchDarkState();
  }, []);


  return (
    <AppContext.Provider
      value={{
        value,
        setValue,
        secondsOn,
        setsecondsOn,
        DarkMode,
        setDarkMode,
        hideStatusbar,
        sethideStatusbar,
        currentStreak,
        setcurrentStreak,
        longestStreak,
        setlongestStreak,
        bestDayTime,
        setBestDayTime,
        isFireActive,
        setisFireActive,
        isInitialized,
        setIsInitialized,
        fetchSecondsShowState,
        isDarkInitialized,
        setIsDarkInitialized
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
