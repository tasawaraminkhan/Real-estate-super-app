import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";

export default function MaterialsScreen() {
  const [marla, setMarla] = useState("5");
  const n = parseFloat(marla) || 5;
  const sqft = n * 225;

  const bom = useMemo(() => {
    const cement = Math.round(sqft * 0.42);
    const steel = Math.round(sqft * 4.2);
    const bricks = Math.round(sqft * 8.5);
    const labourDays = Math.round(sqft / 80);
    return [
      { item: "Cement (bags)", qty: cement, note: "Grey structure baseline" },
      { item: "Steel (kg)", qty: steel, note: "Approx TMT" },
      { item: "Bricks (nos)", qty: bricks, note: "First-class" },
      { item: "Labour days", qty: labourDays, note: "Crew average" },
    ];
  }, [sqft]);

  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={s.h1}>Materials & Budget Planner</Text>
        <Text style={s.sub}>Bill of quantities from plot size · supplier link-ready</Text>

        <Text style={s.label}>Plot size (Marla)</Text>
        <TextInput style={s.input} keyboardType="decimal-pad" value={marla} onChangeText={setMarla} placeholder="e.g. 5 or 12.5" placeholderTextColor={colors.textMuted} />

        <Text style={s.meta}>{sqft.toLocaleString()} sq.ft covered baseline</Text>

        {bom.map((b) => (
          <View key={b.item} style={s.card}>
            <Text style={s.item}>{b.item}</Text>
            <Text style={s.qty}>{b.qty.toLocaleString()}</Text>
            <Text style={s.note}>{b.note}</Text>
          </View>
        ))}

        <Pressable style={s.btn} onPress={() => router.push("/(tabs)/estimate")}>
          <Text style={s.btnText}>Open full cost calculator</Text>
        </Pressable>
        <Text style={s.footer}>AR room visualizer requires device camera + 3D assets in a later release.</Text>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600", marginBottom: 8, marginTop: 4 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: colors.primaryDark, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, fontSize: 16, color: colors.text },
  meta: { marginTop: 8, color: colors.textMuted, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  item: { fontWeight: "700", color: colors.text },
  qty: { fontSize: 20, fontWeight: "800", color: colors.primary, marginTop: 4 },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  btn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  footer: { fontSize: 12, color: colors.textMuted, marginTop: 16, lineHeight: 18 },
});
