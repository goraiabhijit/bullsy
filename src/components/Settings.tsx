import { View, Text, Pressable } from "react-native";

import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { darkTheme,lightTheme } from "@/theme"; 
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";




      
      const settings = () => {
        const { DarkMode } = useContext(AppContext);
        const theme = DarkMode ? darkTheme : lightTheme;
        return (
            <View  >

           <Pressable>
        <Link href="/settingsScreen">
        <MaterialCommunityIcons name="cog" size={35} color={theme.secondaryText} />
        </Link>
      </Pressable>
            </View>
        )
      }
      
      export default settings
      
      