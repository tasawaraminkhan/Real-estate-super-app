import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";
import { authApi } from "../../lib/api";
import { normalizePkPhone } from "../../lib/format";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    const normalized = normalizePkPhone(phone);
    if (!normalized) {
      Alert.alert("Invalid number", "Enter a valid Pakistan mobile number (03XXXXXXXXX).");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.requestOtp(normalized);
      if (res.devOtp) {
        Alert.alert("Demo OTP", `Use code: ${res.devOtp}`);
      }
      router.push({ pathname: "/(auth)/otp", params: { phone: normalized } });
    } catch (e: unknown) {
      Alert.alert("Could not send OTP", e instanceof Error ? e.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.wrap}>
        <Text style={s.kicker}>PROPVERSE</Text>
        <Text style={s.title}>Sign in with mobile</Text>
        <Text style={s.sub}>We will send a one-time verification code.</Text>
        <TextInput
          style={s.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="03XXXXXXXXX"
          placeholderTextColor={colors.textMuted}
          maxLength={13}
          autoComplete="tel"
        />
        <Pressable style={[s.btn, loading && { opacity: 0.6 }]} onPress={sendOtp} disabled={loading}>
          <Text style={s.btnText}>{loading ? "Sending…" : "Send OTP"}</Text>
        </Pressable>
        <Text style={s.hint}>Demo: any valid number + OTP 123456</Text>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", paddingBottom: 40 },
  kicker: { color: colors.primary, letterSpacing: 2, fontSize: 12, fontWeight: "700", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 24, marginTop: 8, lineHeight: 20 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  hint: { marginTop: 16, color: colors.textMuted, fontSize: 13, textAlign: "center" },
});
