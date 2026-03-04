import { createContext, useActionState, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [value, setValue] = useState(false); // your single state
  const [secondsOn, setsecondsOn] = useState(true);
  const [Darkmode, setDarkmode] = useState(false);
  const [hideStatusbar, sethideStatusbar] = useState(false);
  const [currentStreak, setcurrentStreak] = useState(0);

  //for longest streak displaying in history
  const [longestStreak, setlongestStreak] = useState(0);
   const [bestDayTime, setBestDayTime] = useState(0);
    const [isFireActive, setisFireActive] = useState(false);



  return (
    <AppContext.Provider value={{ value, setValue, secondsOn, setsecondsOn, Darkmode, setDarkmode ,hideStatusbar, sethideStatusbar, currentStreak, setcurrentStreak, longestStreak, setlongestStreak, bestDayTime, setBestDayTime, isFireActive, setisFireActive }}>

      {children}
    </AppContext.Provider>
  );
}