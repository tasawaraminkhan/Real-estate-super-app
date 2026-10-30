import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";

export default function LegalCheckScreen() {
  const [token, setToken] = useState("");
  const [society, setSociety] = useState("");
  const [result, setResult] = useState<null | { score: number; flags: string[]; noc: string }>(null);

  function runCheck() {
    if (!token.trim() && !society.trim()) {
      Alert.alert("Input required", "Enter a registry/Fard token or society name.");
      return;
    }
    // Demo heuristic — production: OCR + authority APIs
    const flags: string[] = [];
    let score = 15;
    if (/double|dispute|tehsil/i.test(token + society)) {
      flags.push("Possible dispute keywords detected");
      score += 40;
    }
    if (token.length > 0 && token.length < 6) {
      flags.push("Token format looks incomplete");
      score += 20;
    }
    if (!flags.length) flags.push("No obvious red flags in demo scan");
    const noc = /dha|bahria|park view/i.test(society) ? "Likely NOC-approved (verify with LDA/CDA/RDA)" : "NOC status unknown — verify with local authority";
    setResult({ score: Math.min(100, score), flags, noc });
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={s.h1}>Legal & Fraud Shield</Text>
        <Text style={s.sub}>Fard / registry token check · society NOC badge (demo engine)</Text>

        <Text style={s.label}>Registry / Fard token number</Text>
        <TextInput style={s.input} value={token} onChangeText={setToken} placeholder="e.g. LDA-2024-XXXX" placeholderTextColor={colors.textMuted} />

        <Text style={s.label}>Society / scheme name</Text>
        <TextInput style={s.input} value={society} onChangeText={setSociety} placeholder="e.g. DHA Phase 5, LDA City" placeholderTextColor={colors.textMuted} />

        <Pressable style={s.btn} onPress={runCheck}>
          <Text style={s.btnText}>Run fraud scan</Text>
        </Pressable>

        <Text style={s.note}>
          Production connects OCR on document photos and authority databases (LDA, CDA, RDA, FDA). This build uses a safe demo scorer only.
        </Text>

        {result ? (
          <View style={s.card}>
            <Text style={s.score}>Risk score: {result.score}/100</Text>
            <Text style={[s.badge, { color: result.score >= 50 ? colors.danger : colors.success }]}>
              {result.score >= 50 ? "Elevated risk — manual review advised" : "Low demo risk"}
            </Text>
            <Text style={s.noc}>{result.noc}</Text>
            {result.flags.map((f) => (
              <Text key={f} style={s.flag}>• {f}</Text>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600", marginBottom: 8, marginTop: 4 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: colors.primaryDark, marginTop: 12, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, fontSize: 16, color: colors.text },
  btn: { marginTop: 20, backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 12, lineHeight: 18 },
  card: { marginTop: 16, backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  score: { fontSize: 18, fontWeight: "800", color: colors.text },
  badge: { marginTop: 6, fontWeight: "700" },
  noc: { marginTop: 10, color: colors.textSecondary },
  flag: { marginTop: 6, color: colors.textMuted },
});
