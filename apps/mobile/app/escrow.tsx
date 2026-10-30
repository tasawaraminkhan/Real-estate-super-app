import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";

const MILESTONES = [
  { id: "token", label: "Token money locked", done: true },
  { id: "docs", label: "Document verification", done: true },
  { id: "intiqal", label: "Intiqal / transfer at registrar", done: false },
  { id: "release", label: "Funds released to seller", done: false },
];

export default function EscrowScreen() {
  const [amount, setAmount] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  function createDeal() {
    if (!amount || !(parseFloat(amount) > 0)) {
      Alert.alert("Amount", "Enter token or down-payment amount (PKR).");
      return;
    }
    Alert.alert(
      "Escrow deal created (demo)",
      `Role: ${role}\nAmount: PKR ${amount}\n\nProduction holds funds with a licensed payment partner until Intiqal completes.`,
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={s.h1}>Escrow Safe Deal</Text>
        <Text style={s.sub}>No-commission P2P channel · milestone-based lock</Text>

        <View style={s.row}>
          {(["buyer", "seller"] as const).map((r) => (
            <Pressable key={r} style={[s.chip, role === r && s.chipOn]} onPress={() => setRole(r)}>
              <Text style={[s.chipText, role === r && s.chipTextOn]}>{r === "buyer" ? "I am Buyer" : "I am Owner"}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Token / down payment (PKR)</Text>
        <TextInput style={s.input} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} placeholder="e.g. 500000" placeholderTextColor={colors.textMuted} />

        <Pressable style={s.btn} onPress={createDeal}>
          <Text style={s.btnText}>Create escrow deal</Text>
        </Pressable>

        <Text style={s.section}>Milestones</Text>
        {MILESTONES.map((m) => (
          <View key={m.id} style={s.mile}>
            <View style={[s.dot, m.done && s.dotOn]} />
            <Text style={s.mileText}>{m.label}</Text>
          </View>
        ))}
        <Text style={s.note}>Feature-flagged for legal/compliance. Demo only — no real funds move in this build.</Text>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600", marginBottom: 8, marginTop: 4 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 16 },
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.surface },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontWeight: "600" },
  chipTextOn: { color: "#fff" },
  label: { fontSize: 13, fontWeight: "600", color: colors.primaryDark, marginTop: 12, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, fontSize: 16, color: colors.text },
  btn: { marginTop: 16, backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  section: { marginTop: 24, fontWeight: "700", color: colors.text, marginBottom: 12 },
  mile: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.border },
  dotOn: { backgroundColor: colors.success, borderColor: colors.success },
  mileText: { color: colors.textSecondary },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 16, lineHeight: 18 },
});
