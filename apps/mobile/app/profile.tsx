import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";
import { getToken, setToken } from "../lib/api";

export default function ProfileScreen() {
  const [name, setName] = useState("Demo User");
  const [cnic, setCnic] = useState("");
  const [role, setRole] = useState<"BUYER" | "OWNER" | "AGENT">("BUYER");
  const [kycStatus, setKycStatus] = useState<"UNVERIFIED" | "PENDING" | "VERIFIED">("UNVERIFIED");

  function submitKyc() {
    if (!/^\d{5}-\d{7}-\d$/.test(cnic) && !/^\d{13}$/.test(cnic.replace(/-/g, ""))) {
      Alert.alert("CNIC", "Use format 12345-1234567-1 or 13 digits.");
      return;
    }
    setKycStatus("PENDING");
    Alert.alert("KYC submitted", "Demo review queue. Production: CNIC image + verification partner.");
  }

  function logout() {
    setToken(null);
    router.replace("/(auth)/phone");
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.h1}>Profile</Text>
        <Text style={s.sub}>{getToken() ? "Signed in" : "Guest"}</Text>

        <Text style={s.label}>Full name</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholderTextColor={colors.textMuted} />

        <Text style={s.label}>Role</Text>
        <View style={s.row}>
          {(["BUYER", "OWNER", "AGENT"] as const).map((r) => (
            <Pressable key={r} style={[s.chip, role === r && s.chipOn]} onPress={() => setRole(r)}>
              <Text style={[s.chipText, role === r && s.chipTextOn]}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>CNIC (KYC)</Text>
        <TextInput style={s.input} value={cnic} onChangeText={setCnic} placeholder="12345-1234567-1" placeholderTextColor={colors.textMuted} keyboardType="numbers-and-punctuation" />
        <Text style={s.meta}>Status: {kycStatus}</Text>
        <Pressable style={s.btn} onPress={submitKyc}><Text style={s.btnText}>Submit KYC</Text></Pressable>

        <Pressable style={s.link} onPress={() => router.push("/favourites")}><Text style={s.linkText}>My favourites →</Text></Pressable>
        <Pressable style={s.link} onPress={() => router.push("/(tabs)/plans")}><Text style={s.linkText}>Subscription plans →</Text></Pressable>
        <Pressable style={[s.btn, { backgroundColor: colors.danger, marginTop: 24 }]} onPress={logout}>
          <Text style={s.btnText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600", marginBottom: 8 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: colors.primaryDark, marginTop: 12, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, fontSize: 16, color: colors.text },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  meta: { marginTop: 8, color: colors.textMuted },
  btn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  link: { marginTop: 16 },
  linkText: { color: colors.primary, fontWeight: "600", fontSize: 16 },
});
