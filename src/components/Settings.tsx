import { View, Text, Pressable } from "react-native";

import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";




      
      const settings = () => {
        return (
            <View  style={{ position: "absolute", top: 50, right: 20 }}>

           <Pressable>
        <Link href="/settingsScreen">
        <MaterialCommunityIcons name="cog" size={27} color="black" />
        </Link>
      </Pressable>
            </View>
        )
      }
      
      export default settings
      
      