import { Tabs } from "expo-router";
import { Text, StyleSheet, View } from "react-native";
import { colors } from "../../src/theme/tokens";

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.icon, focused && styles.iconOn]}>{symbol}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon symbol="⌂" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => <TabIcon symbol="◎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="estimate"
        options={{
          title: "Cost",
          tabBarIcon: ({ focused }) => <TabIcon symbol="▣" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Sell",
          tabBarIcon: ({ focused }) => <TabIcon symbol="＋" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: "Leads",
          tabBarIcon: ({ focused }) => <TabIcon symbol="☰" focused={focused} />,
        }}
      />
      <Tabs.Screen name="plans" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#FFFFFF",
    height: 58,
    paddingBottom: 6,
    paddingTop: 4,
    borderTopColor: "rgba(15,28,25,0.12)",
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8,
  },
  label: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  iconWrap: { alignItems: "center", justifyContent: "center", minHeight: 22 },
  icon: { fontSize: 18, color: colors.textMuted, lineHeight: 22 },
  iconOn: { color: colors.primary },
});
