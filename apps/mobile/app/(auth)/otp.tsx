import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { authApi } from "../../lib/api";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify() {
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone ?? "", code);
      // Store token later via SecureStore
      console.log("token", res.accessToken);
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      Alert.alert("OTP galat", JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.wrap}>
      <Text style={s.title}>6-digit OTP</Text>
      <Text style={s.sub}>{phone}</Text>
      <TextInput
        style={s.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        placeholder="••••••"
        placeholderTextColor="#4A5A55"
      />
      <Pressable style={s.btn} onPress={verify} disabled={loading}>
        <Text style={s.btnText}>Verify</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#EEF1EC", padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#0F1C19" },
  sub: { color: "#4A5A55", marginBottom: 24, marginTop: 4 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.13)",
    padding: 16,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
    marginBottom: 16,
    color: "#0F1C19",
  },
  btn: { backgroundColor: "#0D6B5F", borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
