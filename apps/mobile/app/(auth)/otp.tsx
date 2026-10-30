import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { colors } from "../../src/theme/tokens";
import { authApi } from "../../lib/api";
import { displayPkPhone } from "../../lib/format";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify() {
    if (!/^\d{6}$/.test(code.trim())) {
      Alert.alert("Invalid code", "Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyOtp(phone ?? "", code.trim());
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e && "error" in e
          ? String((e as { error?: { message?: string } }).error?.message ?? "Invalid OTP")
          : "Invalid OTP. Demo code: 123456";
      Alert.alert("Verification failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.wrap}>
        <Text style={s.title}>Enter verification code</Text>
        <Text style={s.sub}>{phone ? displayPkPhone(phone) : ""}</Text>
        <TextInput
          style={s.input}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          placeholderTextColor={colors.textMuted}
          autoFocus
        />
        <Pressable style={[s.btn, loading && { opacity: 0.6 }]} onPress={verify} disabled={loading}>
          <Text style={s.btnText}>{loading ? "Verifying…" : "Verify & continue"}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={s.link}>Change number</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 24, marginTop: 8 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    fontSize: 24,
    letterSpacing: 10,
    textAlign: "center",
    color: colors.text,
    marginBottom: 16,
  },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: colors.primary, fontWeight: "600", textAlign: "center" },
});
