import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";

const WORKERS = [
  { id: "1", name: "Imran Mistri", skill: "Mason / grey structure", rate: "PKR 2,500 / day", rating: "4.8" },
  { id: "2", name: "Khalid Electric", skill: "Electrician", rate: "PKR 2,000 / day", rating: "4.6" },
  { id: "3", name: "Bilal Plumbing", skill: "Plumber", rate: "PKR 1,800 / day", rating: "4.5" },
  { id: "4", name: "Shuttering Co.", skill: "Shuttering supplier", rate: "PKR 45 / sq.ft", rating: "4.7" },
];

export default function LabourScreen() {
  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={s.h1}>Labour & Contractor Board</Text>
        <Text style={s.sub}>Verified local workforce · rate cards</Text>
        {WORKERS.map((w) => (
          <View key={w.id} style={s.card}>
            <Text style={s.name}>{w.name}</Text>
            <Text style={s.skill}>{w.skill}</Text>
            <Text style={s.rate}>{w.rate} · ★ {w.rating}</Text>
            <Pressable style={s.btn} onPress={() => Linking.openURL("tel:+923001234567")}>
              <Text style={s.btnText}>Call</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600", marginBottom: 8, marginTop: 4 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  name: { fontWeight: "700", fontSize: 16, color: colors.text },
  skill: { color: colors.textMuted, marginTop: 4 },
  rate: { color: colors.primary, fontWeight: "600", marginTop: 6 },
  btn: { marginTop: 12, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, padding: 10, alignItems: "center" },
  btnText: { color: colors.primary, fontWeight: "700" },
});
