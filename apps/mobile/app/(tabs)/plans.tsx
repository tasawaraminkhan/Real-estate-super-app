import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";

const PLANS = [
  { code: "FREE", name: "Free", price: "0", listings: "3", photos: "5", note: "Get started" },
  { code: "STARTER", name: "Starter", price: "3,000", listings: "15", photos: "25", note: "For individual agents" },
  { code: "PROFESSIONAL", name: "Professional", price: "8,000", listings: "50", photos: "25", note: "5 featured credits / month" },
  { code: "AGENCY", name: "Agency", price: "20,000", listings: "200", photos: "25", note: "10 seats · 20 featured credits" },
];

export default function PlansScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingTop: space.sm }}>
        <Text style={s.h1}>Plans</Text>
        <Text style={s.sub}>PKR / month · mock billing ready on API</Text>
        {PLANS.map((p) => (
          <View key={p.code} style={s.card}>
            <View style={s.cardTop}>
              <Text style={s.name}>{p.name}</Text>
              <Text style={s.price}>{p.price === "0" ? "Free" : `PKR ${p.price}`}</Text>
            </View>
            <Text style={s.meta}>
              {p.listings} listings · {p.photos} photos
            </Text>
            <Text style={s.note}>{p.note}</Text>
            <Pressable
              style={s.btn}
              onPress={() =>
                Alert.alert(
                  p.name,
                  p.code === "FREE"
                    ? "Free plan is active in demo."
                    : "When the API is online, billing intent → confirm will activate this plan.",
                )
              }
            >
              <Text style={s.btnText}>{p.code === "FREE" ? "Current" : "Upgrade"}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 18, fontWeight: "700", color: colors.text },
  price: { fontSize: 16, fontWeight: "700", color: colors.primary },
  meta: { color: colors.textMuted, marginTop: 6 },
  note: { color: colors.textSecondary, marginTop: 4, fontSize: 13 },
  btn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
});
