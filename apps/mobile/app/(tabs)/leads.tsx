import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TextInput } from "react-native";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";
import { openCall, openWhatsApp } from "../../lib/contact";

type Lead = {
  id: string;
  name: string;
  property: string;
  status: "NEW" | "CONTACTED" | "VISIT" | "NEGOTIATION";
  phone: string;
};

const DEMO: Lead[] = [
  { id: "1", name: "Ahmed Khan", property: "10 Marla DHA Phase 5 · Plot", status: "NEW", phone: "+923001112233" },
  { id: "2", name: "Sara Malik", property: "5 Marla Bahria Town · House", status: "CONTACTED", phone: "+923224445566" },
  { id: "3", name: "Bilal Raza", property: "1 Kanal DHA Islamabad · Villa", status: "VISIT", phone: "+923337778899" },
  { id: "4", name: "Fatima Noor", property: "Shop MM Alam · Commercial", status: "NEGOTIATION", phone: "+923218889900" },
  { id: "5", name: "Usman Ali", property: "3 Marla Gulberg · Flat rent", status: "NEW", phone: "+923455556677" },
];

const FILTERS = ["ALL", "NEW", "CONTACTED", "VISIT", "NEGOTIATION"] as const;

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  NEW: { bg: "#DBEAFE", fg: "#1D4ED8" },
  CONTACTED: { bg: "#FEF3C7", fg: "#B45309" },
  VISIT: { bg: "#D1FAE5", fg: "#047857" },
  NEGOTIATION: { bg: "#EDE9FE", fg: "#6D28D9" },
};

export default function LeadsScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    return DEMO.filter((l) => {
      if (filter !== "ALL" && l.status !== filter) return false;
      if (q.trim()) {
        const qq = q.toLowerCase();
        return l.name.toLowerCase().includes(qq) || l.property.toLowerCase().includes(qq) || l.status.toLowerCase().includes(qq);
      }
      return true;
    });
  }, [filter, q]);

  return (
    <Screen padded={false}>
      <View style={s.header}>
        <Text style={s.h1}>Leads</Text>
        <Text style={s.sub}>Lead management for agents</Text>
        <TextInput
          style={s.search}
          placeholder="Search by name, status, or property…"
          placeholderTextColor={colors.textMuted}
          value={q}
          onChangeText={setQ}
        />
        <View style={s.filters}>
          {FILTERS.map((f) => (
            <Pressable key={f} style={[s.chip, filter === f && s.chipOn]} onPress={() => setFilter(f)}>
              <Text style={[s.chipText, filter === f && s.chipTextOn]}>{f === "ALL" ? "All" : f}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space.lg, gap: 12, paddingBottom: 40 }}
        ListEmptyComponent={<Text style={s.empty}>No leads match</Text>}
        renderItem={({ item }) => {
          const st = STATUS_STYLE[item.status];
          return (
            <View style={s.card}>
              <View style={s.cardTop}>
                <Text style={s.name}>{item.name}</Text>
                <View style={[s.badge, { backgroundColor: st.bg }]}>
                  <Text style={[s.badgeText, { color: st.fg }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={s.prop}>{item.property}</Text>
              <View style={s.actions}>
                <Pressable style={s.btn} onPress={() => openCall(item.phone)}>
                  <Text style={s.btnText}>Call</Text>
                </Pressable>
                <Pressable
                  style={s.btnOutline}
                  onPress={() =>
                    openWhatsApp(item.phone, `Hi ${item.name}, regarding ${item.property} on PropVerse.`)
                  }
                >
                  <Text style={s.btnOutlineText}>WhatsApp</Text>
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
  header: { paddingHorizontal: space.lg, paddingTop: space.sm },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: 12 },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    marginBottom: 10,
  },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.textSecondary },
  chipTextOn: { color: "#fff" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "700", color: colors.text },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  prop: { color: colors.textMuted, marginTop: 6, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: colors.primary, fontWeight: "700" },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.success,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnOutlineText: { color: colors.success, fontWeight: "700" },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 40 },
});
