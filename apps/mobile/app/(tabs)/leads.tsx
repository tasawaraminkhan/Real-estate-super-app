import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";

const DEMO = [
  { id: "1", name: "Ahmed", stage: "NEW", property: "10 Marla DHA Phase 5", phone: "0300***" },
  { id: "2", name: "Sara", stage: "CONTACTED", property: "5 Marla Bahria", phone: "0321***" },
  { id: "3", name: "Usman", stage: "VISIT_SCHEDULED", property: "1 Kanal Islamabad", phone: "0333***" },
];

const STAGE_COLOR: Record<string, string> = {
  NEW: "#0D6B5F",
  CONTACTED: "#C6890B",
  VISIT_SCHEDULED: "#1F7A4C",
  NEGOTIATION: "#B9551B",
};

export default function LeadsScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.h1}>Leads</Text>
      <Text style={s.sub}>CRM · agent view (demo data)</Text>
      <FlatList
        data={DEMO}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.row}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={[s.badge, { color: STAGE_COLOR[item.stage] ?? "#4A5A55" }]}>{item.stage}</Text>
            </View>
            <Text style={s.meta}>{item.property}</Text>
            <Text style={s.phone}>{item.phone}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F1C19", paddingHorizontal: 16, paddingTop: 16 },
  sub: { color: "#4A5A55", paddingHorizontal: 16, marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "700", color: "#0F1C19", fontSize: 16 },
  badge: { fontSize: 11, fontWeight: "700" },
  meta: { color: "#4A5A55", marginTop: 4 },
  phone: { color: "#1D2E29", marginTop: 4, fontSize: 13 },
});
