import { Tabs } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { colors } from "../../src/theme/tokens";

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={[styles.tab, focused && styles.tabOn]}>{label}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ({ focused }) => <TabLabel label="Home" focused={focused} /> }} />
      <Tabs.Screen name="map" options={{ title: "Map", tabBarIcon: ({ focused }) => <TabLabel label="Map" focused={focused} /> }} />
      <Tabs.Screen name="estimate" options={{ title: "Cost", tabBarIcon: ({ focused }) => <TabLabel label="Cost" focused={focused} /> }} />
      <Tabs.Screen name="create" options={{ title: "Sell", tabBarIcon: ({ focused }) => <TabLabel label="Sell" focused={focused} /> }} />
      <Tabs.Screen name="leads" options={{ title: "Leads", tabBarIcon: ({ focused }) => <TabLabel label="Leads" focused={focused} /> }} />
      <Tabs.Screen name="plans" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    height: 60,
    paddingBottom: 6,
    paddingTop: 4,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: { fontSize: 10, color: colors.textMuted, fontWeight: "500" },
  tabOn: { color: colors.primary, fontWeight: "700" },
});
