import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { authApi } from "../../lib/api";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("0300");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setLoading(true);
    try {
      const res = await authApi.requestOtp(phone);
      if (res.devOtp) Alert.alert("Dev OTP", res.devOtp);
      router.push({ pathname: "/(auth)/otp", params: { phone } });
    } catch (e: unknown) {
      Alert.alert("Error", JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.wrap}>
      <Text style={s.kicker}>PROPVERSE</Text>
      <Text style={s.title}>Apna number likho</Text>
      <TextInput
        style={s.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholder="03XXXXXXXXX"
        placeholderTextColor="#4A5A55"
      />
      <Pressable style={[s.btn, loading && { opacity: 0.6 }]} onPress={sendOtp} disabled={loading}>
        <Text style={s.btnText}>{loading ? "Bhej rahe hain…" : "OTP bhejo"}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#EEF1EC", padding: 24, justifyContent: "center" },
  kicker: { color: "#0D6B5F", letterSpacing: 2, fontSize: 12, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "800", color: "#0F1C19", marginBottom: 24 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.13)",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#0F1C19",
    marginBottom: 16,
  },
  btn: { backgroundColor: "#0D6B5F", borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
