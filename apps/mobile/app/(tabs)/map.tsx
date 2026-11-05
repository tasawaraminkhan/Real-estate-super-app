import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";
import { formatPriceFromPaisa } from "../../lib/format";

type Plot = {
  id: string;
  plotNo: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "BLOCKED";
  areaMarla: number;
  priceAmount?: string;
  noc: boolean;
  commercial?: boolean;
  highRoi?: boolean;
  underConstruction?: boolean;
};

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: "#1F7A4C",
  RESERVED: "#C6890B",
  SOLD: "#9B1C1C",
  BLOCKED: "#6B7280",
};

const DEMO_PLOTS: Plot[] = [
  { id: "1", plotNo: "214", status: "AVAILABLE", areaMarla: 10, priceAmount: "24500000000", noc: true, highRoi: true },
  { id: "2", plotNo: "215", status: "RESERVED", areaMarla: 10, priceAmount: "23800000000", noc: true },
  { id: "3", plotNo: "216", status: "SOLD", areaMarla: 10, noc: true },
  { id: "4", plotNo: "217", status: "AVAILABLE", areaMarla: 5, priceAmount: "12000000000", noc: false, underConstruction: true },
  { id: "5", plotNo: "218", status: "AVAILABLE", areaMarla: 7, priceAmount: "16500000000", noc: true, highRoi: true },
  { id: "6", plotNo: "219", status: "BLOCKED", areaMarla: 10, noc: false },
  { id: "7", plotNo: "220", status: "AVAILABLE", areaMarla: 10, priceAmount: "25000000000", noc: true, commercial: true },
  { id: "8", plotNo: "221", status: "SOLD", areaMarla: 5, noc: true },
  { id: "9", plotNo: "222", status: "AVAILABLE", areaMarla: 8, priceAmount: "19800000000", noc: true },
  { id: "10", plotNo: "223", status: "RESERVED", areaMarla: 12, priceAmount: "31000000000", noc: true, highRoi: true },
  { id: "11", plotNo: "224", status: "AVAILABLE", areaMarla: 5, priceAmount: "11200000000", noc: true, underConstruction: true },
  { id: "12", plotNo: "225", status: "AVAILABLE", areaMarla: 10, priceAmount: "26000000000", noc: false },
];

const LAYERS = [
  { id: "noc", label: "NOC only" },
  { id: "commercial", label: "Commercial" },
  { id: "roi", label: "High ROI" },
  { id: "uc", label: "Under construction" },
] as const;

export default function MapScreen() {
  const [selected, setSelected] = useState<Plot | null>(null);
  const [layers, setLayers] = useState<Record<string, boolean>>({ noc: false });

  const visible = useMemo(() => {
    return DEMO_PLOTS.filter((p) => {
      if (layers.noc && !p.noc) return false;
      if (layers.commercial && !p.commercial) return false;
      if (layers.roi && !p.highRoi) return false;
      if (layers.uc && !p.underConstruction) return false;
      return true;
    });
  }, [layers]);

  function toggle(id: string) {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} stickyHeaderIndices={[]}>
        <View style={s.header}>
          <Text style={s.h1}>Society Map</Text>
          <Text style={s.sub}>DHA-style master plan · plot inventory (demo)</Text>
        </View>

        <Text style={s.section}>Layers</Text>
        <View style={s.layerRow}>
          {LAYERS.map((l) => {
            const on = !!layers[l.id];
            return (
              <Pressable key={l.id} style={[s.chip, on && s.chipOn]} onPress={() => toggle(l.id)}>
                <Text style={[s.chipText, on && s.chipTextOn]} numberOfLines={1}>
                  {l.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={s.legend}>
          {Object.entries(STATUS_COLOR).map(([k, c]) => (
            <View key={k} style={s.legendItem}>
              <View style={[s.dot, { backgroundColor: c }]} />
              <Text style={s.legendText}>{k}</Text>
            </View>
          ))}
        </View>

        <View style={s.grid}>
          {visible.map((p) => (
            <Pressable
              key={p.id}
              style={[
                s.plot,
                { backgroundColor: STATUS_COLOR[p.status] },
                selected?.id === p.id && s.plotSelected,
              ]}
              onPress={() => setSelected(p)}
            >
              <Text style={s.plotNo}>{p.plotNo}</Text>
              {p.noc ? <Text style={s.plotBadge}>NOC</Text> : null}
            </Pressable>
          ))}
        </View>
        {visible.length === 0 ? (
          <Text style={s.empty}>No plots match these layers</Text>
        ) : null}

        {selected ? (
          <View style={s.card}>
            <Text style={s.cardTitle}>Plot {selected.plotNo}</Text>
            <Text style={s.cardMeta}>
              {selected.status} · {selected.areaMarla} Marla
              {selected.priceAmount ? ` · ${formatPriceFromPaisa(selected.priceAmount)}` : ""}
            </Text>
            <Text style={s.cardNoc}>
              {selected.noc ? "✓ NOC approved society" : "⚠ NOC not verified"}
            </Text>
            {selected.highRoi ? <Text style={s.tag}>High ROI zone</Text> : null}
            {selected.commercial ? <Text style={s.tag}>Commercial corridor</Text> : null}
            {selected.underConstruction ? <Text style={s.tag}>Under construction</Text> : null}
          </View>
        ) : (
          <Text style={s.hint}>Tap a plot for details</Text>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: space.lg, paddingTop: space.sm },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginTop: 4, marginBottom: 12 },
  section: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: space.lg,
    marginBottom: 8,
  },
  layerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: space.lg,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  chipTextOn: { color: "#fff" },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: space.lg,
    marginBottom: 12,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: space.lg,
    marginBottom: 16,
  },
  plot: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
    minHeight: 72,
  },
  plotSelected: {
    borderWidth: 3,
    borderColor: "#0F1C19",
  },
  plotNo: { color: "#fff", fontWeight: "800", fontSize: 16 },
  plotBadge: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  card: {
    marginHorizontal: space.lg,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  cardMeta: { color: colors.textSecondary, marginTop: 6 },
  cardNoc: { marginTop: 8, color: colors.primary, fontWeight: "600" },
  tag: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#EEF1EC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  hint: { textAlign: "center", color: colors.textMuted, marginTop: 8 },
  empty: { textAlign: "center", color: colors.textMuted, padding: 24 },
});
