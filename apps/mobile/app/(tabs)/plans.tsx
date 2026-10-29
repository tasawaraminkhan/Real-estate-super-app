import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Alert } from "react-native";

const PLANS = [
  { code: "FREE", name: "Free", price: "0", listings: "3", photos: "5", note: "Shuru karo" },
  { code: "STARTER", name: "Starter", price: "3,000", listings: "15", photos: "25", note: "Agents ke liye" },
  { code: "PROFESSIONAL", name: "Professional", price: "8,000", listings: "50", photos: "25", note: "5 featured credits" },
  { code: "AGENCY", name: "Agency", price: "20,000", listings: "200", photos: "25", note: "10 seats · 20 credits" },
];

export default function PlansScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.h1}>Plans</Text>
        <Text style={s.sub}>PKR / month · mock payment API ready</Text>
        {PLANS.map((p) => (
          <View key={p.code} style={s.card}>
            <View style={s.cardTop}>
              <Text style={s.name}>{p.name}</Text>
              <Text style={s.price}>
                {p.price === "0" ? "Free" : `PKR ${p.price}`}
              </Text>
            </View>
            <Text style={s.meta}>{p.listings} listings · {p.photos} photos</Text>
            <Text style={s.note}>{p.note}</Text>
            <Pressable
              style={s.btn}
              onPress={() =>
                Alert.alert(
                  p.name,
                  p.code === "FREE"
                    ? "Free plan active (demo)."
                    : "API online hone par /billing/intent → confirm chalega.",
                )
              }
            >
              <Text style={s.btnText}>{p.code === "FREE" ? "Current" : "Upgrade"}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  pad: { padding: 16, paddingBottom: 40 },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F1C19" },
  sub: { color: "#4A5A55", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 18, fontWeight: "700", color: "#0F1C19" },
  price: { fontSize: 16, fontWeight: "700", color: "#0D6B5F" },
  meta: { color: "#4A5A55", marginTop: 6 },
  note: { color: "#1D2E29", marginTop: 4, fontSize: 13 },
  btn: {
    marginTop: 12,
    backgroundColor: "#0D6B5F",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
