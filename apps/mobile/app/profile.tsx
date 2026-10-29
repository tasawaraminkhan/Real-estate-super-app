import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { getToken, setToken } from "../lib/api";

export default function ProfileScreen() {
  const [name, setName] = useState("Demo User");
  const [cnic, setCnic] = useState("");
  const [role, setRole] = useState<"BUYER" | "OWNER" | "AGENT">("BUYER");
  const [kycStatus, setKycStatus] = useState<"UNVERIFIED" | "PENDING" | "VERIFIED">("UNVERIFIED");

  function submitKyc() {
    if (!/^\d{5}-\d{7}-\d$/.test(cnic) && !/^\d{13}$/.test(cnic.replace(/-/g, ""))) {
      Alert.alert("CNIC", "Format: 12345-1234567-1 ya 13 digits");
      return;
    }
    setKycStatus("PENDING");
    Alert.alert("KYC submitted", "Demo: review queue mein. Production mein CNIC image + NADRA flow.");
  }

  function logout() {
    setToken(null);
    router.replace("/(auth)/phone");
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.pad}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.back}>← Back</Text>
        </Pressable>
        <Text style={s.h1}>Profile</Text>
        <Text style={s.sub}>Token: {getToken() ? "signed in" : "guest"}</Text>

        <Text style={s.label}>Full name</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholderTextColor="#4A5A55" />

        <Text style={s.label}>Role</Text>
        <View style={s.row}>
          {(["BUYER", "OWNER", "AGENT"] as const).map((r) => (
            <Pressable key={r} style={[s.chip, role === r && s.chipOn]} onPress={() => setRole(r)}>
              <Text style={[s.chipText, role === r && s.chipTextOn]}>{r}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>CNIC (KYC)</Text>
        <TextInput
          style={s.input}
          value={cnic}
          onChangeText={setCnic}
          placeholder="12345-1234567-1"
          placeholderTextColor="#4A5A55"
          keyboardType="numbers-and-punctuation"
        />
        <Text style={s.meta}>Status: {kycStatus}</Text>
        <Pressable style={s.btn} onPress={submitKyc}>
          <Text style={s.btnText}>Submit KYC</Text>
        </Pressable>

        <Pressable style={s.link} onPress={() => router.push("/favourites")}>
          <Text style={s.linkText}>My favourites →</Text>
        </Pressable>
        <Pressable style={s.link} onPress={() => router.push("/(tabs)/plans")}>
          <Text style={s.linkText}>Subscription plans →</Text>
        </Pressable>
        <Pressable style={[s.btn, { backgroundColor: "#9B1C1C", marginTop: 24 }]} onPress={logout}>
          <Text style={s.btnText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  pad: { padding: 16, paddingBottom: 40 },
  back: { color: "#0D6B5F", fontWeight: "600", marginBottom: 8 },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F1C19" },
  sub: { color: "#4A5A55", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#0A5148", marginTop: 12, marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.13)",
    padding: 14,
    fontSize: 16,
    color: "#0F1C19",
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.15)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: "#0D6B5F", borderColor: "#0D6B5F" },
  chipText: { fontSize: 12, color: "#4A5A55" },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  meta: { marginTop: 8, color: "#4A5A55" },
  btn: { marginTop: 12, backgroundColor: "#0D6B5F", borderRadius: 12, padding: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  link: { marginTop: 16 },
  linkText: { color: "#0D6B5F", fontWeight: "600", fontSize: 16 },
});
