import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 10, color: focused ? "#0D6B5F" : "#4A5A55", fontWeight: focused ? "700" : "400" }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0D6B5F",
        tabBarStyle: { backgroundColor: "#fff", height: 58, paddingBottom: 6 },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ focused }) => <TabIcon label="Map" focused={focused} /> }} />
      <Tabs.Screen name="estimate" options={{ title: "Cost", tabBarIcon: ({ focused }) => <TabIcon label="Cost" focused={focused} /> }} />
      <Tabs.Screen name="create" options={{ title: "Sell", tabBarIcon: ({ focused }) => <TabIcon label="Sell" focused={focused} /> }} />
      <Tabs.Screen name="leads" options={{ title: "Leads", tabBarIcon: ({ focused }) => <TabIcon label="Leads" focused={focused} /> }} />
      <Tabs.Screen name="plans" options={{ href: null }} />
    </Tabs>
  );
}
