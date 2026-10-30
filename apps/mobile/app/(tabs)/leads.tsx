import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Linking,
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";

type Lead = {
  id: string;
  name: string;
  stage: "NEW" | "CONTACTED" | "VISIT_SCHEDULED" | "NEGOTIATION";
  property: string;
  phone: string;
  type: string;
};

const DEMO: Lead[] = [
  { id: "1", name: "Ahmed Khan", stage: "NEW", property: "10 Marla DHA Phase 5", phone: "03001234567", type: "Plot" },
  { id: "2", name: "Sara Ali", stage: "CONTACTED", property: "5 Marla Bahria Town", phone: "03219876543", type: "House" },
  { id: "3", name: "Usman Raza", stage: "VISIT_SCHEDULED", property: "1 Kanal Islamabad", phone: "03331234567", type: "Villa" },
  { id: "4", name: "Fatima Noor", stage: "NEGOTIATION", property: "Shop MM Alam Road", phone: "03451234567", type: "Shop" },
];

const STAGE_STYLE: Record<string, { bg: string; text: string }> = {
  NEW: { bg: "#DBEAFE", text: "#1D4ED8" },
  CONTACTED: { bg: "#FFEDD5", text: "#C2410C" },
  VISIT_SCHEDULED: { bg: "#DCFCE7", text: "#15803D" },
  NEGOTIATION: { bg: "#FEF3C7", text: "#B45309" },
};

const FILTERS = ["ALL", "NEW", "CONTACTED", "VISIT_SCHEDULED", "NEGOTIATION"] as const;

export default function LeadsScreen() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("ALL");

  const filtered = useMemo(() => {
    return DEMO.filter((l) => {
      if (status !== "ALL" && l.stage !== status) return false;
      if (!q.trim()) return true;
      const qq = q.toLowerCase();
      return (
        l.name.toLowerCase().includes(qq) ||
        l.property.toLowerCase().includes(qq) ||
        l.type.toLowerCase().includes(qq) ||
        l.stage.toLowerCase().includes(qq)
      );
    });
  }, [q, status]);

  return (
    <Screen padded={false}>
      <View style={s.header}>
        <Text style={s.h1}>Leads</Text>
        <Text style={s.sub}>Lead Management System</Text>
      </View>
      <View style={s.searchBox}>
        <TextInput
          style={s.search}
          placeholder="Search by name, status, or property..."
          placeholderTextColor={colors.textMuted}
          value={q}
          onChangeText={setQ}
        />
      </View>
      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f} style={[s.chip, status === f && s.chipOn]} onPress={() => setStatus(f)}>
            <Text style={[s.chipText, status === f && s.chipTextOn]}>
              {f === "ALL" ? "All" : f === "VISIT_SCHEDULED" ? "Visit" : f}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space.lg, gap: 10, paddingBottom: 32 }}
        ListEmptyComponent={<Text style={s.empty}>No leads match your filters</Text>}
        renderItem={({ item }) => {
          const st = STAGE_STYLE[item.stage] ?? STAGE_STYLE.NEW;
          return (
            <View style={s.card}>
              <View style={s.cardTop}>
                <Text style={s.name}>{item.name}</Text>
                <View style={[s.badge, { backgroundColor: st.bg }]}>
                  <Text style={[s.badgeText, { color: st.text }]}>{item.stage.replace(/_/g, " ")}</Text>
                </View>
              </View>
              <Text style={s.meta}>{item.property}</Text>
              <Text style={s.type}>{item.type}</Text>
              <View style={s.actions}>
                <Pressable style={s.actionBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                  <Text style={s.actionText}>Call Now</Text>
                </Pressable>
                <Pressable
                  style={[s.actionBtn, s.wa]}
                  onPress={() => Linking.openURL(`https://wa.me/92${item.phone.replace(/^0/, "")}`)}
                >
                  <Text style={[s.actionText, { color: colors.success }]}>WhatsApp</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: space.lg, paddingTop: space.sm, backgroundColor: colors.surface },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: space.sm },
  searchBox: { paddingHorizontal: space.lg, paddingBottom: 8, backgroundColor: colors.surface },
  search: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: space.lg,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontWeight: "700", color: colors.text, fontSize: 16, flex: 1 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  meta: { color: colors.textMuted, marginTop: 6 },
  type: { color: colors.textSecondary, marginTop: 2, fontSize: 13 },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  wa: { borderColor: colors.success },
  actionText: { fontWeight: "700", color: colors.primary, fontSize: 13 },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 40 },
});
