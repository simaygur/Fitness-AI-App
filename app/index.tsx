import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import AIChatScreen from "./screens/AIChatScreen";
import MyWorkouts from "./screens/MyWorkouts";
import SettingsScreen from "./screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: any;
                    if (route.name === "Anasayfa") iconName = "home-outline";
                    else if (route.name === "AI Chat") iconName = "chatbubble-ellipses-outline";
                    else if (route.name === "Sporlarım") iconName = "barbell-outline";
                    else if (route.name === "Ayarlar") iconName = "settings-outline";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#4caf50",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 5 },
            })}
        >
            <Tab.Screen name="AI Chat" component={AIChatScreen} />
            <Tab.Screen name="Anasayfa" component={HomeScreen} />
            <Tab.Screen name="Sporlarım" component={MyWorkouts} />
            <Tab.Screen name="Ayarlar" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
