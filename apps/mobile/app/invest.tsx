import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";

const DEALS = [
  { id: "1", title: "MM Alam commercial floor share", min: "25,000", yield: "9.2%", raised: "62%" },
  { id: "2", title: "Bahria file fractional pool", min: "10,000", yield: "11.0%", raised: "41%" },
  { id: "3", title: "Warehouse REIT-lite unit", min: "50,000", yield: "8.5%", raised: "78%" },
];

export default function InvestScreen() {
  return (
    <Screen>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={s.h1}>Fractional Investment</Text>
        <Text style={s.sub}>REIT-lite pools · track yield in portfolio (demo)</Text>
        {DEALS.map((d) => (
          <View key={d.id} style={s.card}>
            <Text style={s.title}>{d.title}</Text>
            <Text style={s.meta}>Min PKR {d.min} · Target yield {d.yield}</Text>
            <Text style={s.raised}>Raised {d.raised}</Text>
            <Pressable
              style={s.btn}
              onPress={() => Alert.alert("Invest (demo)", "Production requires SECP-compliant structure and KYC.")}
            >
              <Text style={s.btnText}>Invest</Text>
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
  title: { fontWeight: "700", fontSize: 16, color: colors.text },
  meta: { color: colors.textMuted, marginTop: 6 },
  raised: { color: colors.primary, fontWeight: "600", marginTop: 4 },
  btn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 10, padding: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
});
