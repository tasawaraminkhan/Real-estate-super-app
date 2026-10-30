import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";

type Plot = { id: string; plotNo: string; status: string; areaMarla?: number; priceAmount?: string; noc?: boolean };

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: "#1F7A4C",
  RESERVED: "#C6890B",
  SOLD: "#9B1C1C",
  BLOCKED: "#4A5A55",
};

const DEMO_PLOTS: Plot[] = [
  { id: "1", plotNo: "214", status: "AVAILABLE", areaMarla: 10, priceAmount: "24500000000", noc: true },
  { id: "2", plotNo: "215", status: "RESERVED", areaMarla: 10, noc: true },
  { id: "3", plotNo: "216", status: "SOLD", areaMarla: 10, noc: true },
  { id: "4", plotNo: "217", status: "AVAILABLE", areaMarla: 5, priceAmount: "12000000000", noc: false },
  { id: "5", plotNo: "218", status: "AVAILABLE", areaMarla: 7, priceAmount: "16500000000", noc: true },
  { id: "6", plotNo: "219", status: "BLOCKED", areaMarla: 10, noc: false },
  { id: "7", plotNo: "220", status: "AVAILABLE", areaMarla: 10, priceAmount: "25000000000", noc: true },
  { id: "8", plotNo: "221", status: "SOLD", areaMarla: 5, noc: true },
];

const LAYERS = [
  { id: "noc", label: "NOC approved" },
  { id: "commercial", label: "Commercial zones" },
  { id: "roi", label: "High ROI" },
  { id: "uc", label: "Under construction" },
];

function formatPrice(paisa?: string) {
  if (!paisa) return "—";
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `${(pkr / 10_000_000).toFixed(1)} Cr`;
  if (pkr >= 100_000) return `${(pkr / 100_000).toFixed(0)} Lac`;
  return String(Math.round(pkr));
}

export default function MapScreen() {
  const [plots] = useState(DEMO_PLOTS);
  const [selected, setSelected] = useState<Plot | null>(null);
  const [layers, setLayers] = useState<Record<string, boolean>>({ noc: true });

  const visible = plots.filter((p) => {
    if (layers.noc && p.noc === false) return false;
    return true;
  });

  return (
    <Screen>
      <Text style={s.h1}>Society Map</Text>
      <Text style={s.sub}>Master plan · plot inventory</Text>

      <Text style={s.layerTitle}>Map layers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.layerRow}>
        {LAYERS.map((l) => (
          <Pressable
            key={l.id}
            style={[s.chip, layers[l.id] && s.chipOn]}
            onPress={() => setLayers((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
          >
            <Text style={[s.chipText, layers[l.id] && s.chipTextOn]}>{l.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={s.legend}>
        {Object.entries(STATUS_COLOR).map(([k, c]) => (
          <View key={k} style={s.legItem}>
            <View style={[s.dot, { backgroundColor: c }]} />
            <Text style={s.legText}>{k}</Text>
          </View>
        ))}
      </View>

      <View style={s.grid}>
        {visible.map((p) => (
          <Pressable
            key={p.id}
            style={[s.plot, { backgroundColor: STATUS_COLOR[p.status] ?? "#4A5A55" }, selected?.id === p.id && s.plotOn]}
            onPress={() => setSelected(p)}
          >
            <Text style={s.plotNo}>{p.plotNo}</Text>
            {p.noc ? <Text style={s.noc}>NOC</Text> : null}
          </Pressable>
        ))}
      </View>

      {selected ? (
        <View style={s.card}>
          <Text style={s.cardTitle}>Plot {selected.plotNo}</Text>
          <Text style={s.cardMeta}>
            {selected.status} · {selected.areaMarla ?? "—"} Marla · {formatPrice(selected.priceAmount)}
          </Text>
          <Text style={s.nocBadge}>{selected.noc ? "NOC approved society" : "NOC not verified — review carefully"}</Text>
        </View>
      ) : (
        <Text style={s.hint}>Select a plot for details</Text>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: "800", color: colors.text, marginTop: space.sm },
  sub: { color: colors.textMuted, marginBottom: space.md },
  layerTitle: { fontSize: 12, fontWeight: "700", color: colors.textMuted, marginBottom: 8 },
  layerRow: { gap: 8, paddingBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  legItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legText: { fontSize: 11, color: colors.textMuted },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  plot: { width: 72, height: 56, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  plotOn: { borderWidth: 3, borderColor: colors.text },
  plotNo: { color: "#fff", fontWeight: "800", fontSize: 14 },
  noc: { color: "rgba(255,255,255,0.9)", fontSize: 9, fontWeight: "700" },
  card: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontWeight: "800", fontSize: 16, color: colors.text },
  cardMeta: { color: colors.textMuted, marginTop: 4 },
  nocBadge: { marginTop: 8, fontSize: 13, fontWeight: "600", color: colors.primary },
  hint: { marginTop: 16, color: colors.textMuted, textAlign: "center" },
});
