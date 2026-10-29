import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { API_URL } from "../../lib/api";

type Plot = {
  id: string;
  plotNo: string;
  status: string;
  areaMarla?: number;
  priceAmount?: string;
};

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: "#1F7A4C",
  RESERVED: "#C6890B",
  SOLD: "#9B1C1C",
  BLOCKED: "#4A5A55",
};

const DEMO_PLOTS: Plot[] = [
  { id: "1", plotNo: "214", status: "AVAILABLE", areaMarla: 10, priceAmount: "24500000000" },
  { id: "2", plotNo: "215", status: "RESERVED", areaMarla: 10 },
  { id: "3", plotNo: "216", status: "SOLD", areaMarla: 10 },
  { id: "4", plotNo: "217", status: "AVAILABLE", areaMarla: 5, priceAmount: "12000000000" },
  { id: "5", plotNo: "218", status: "AVAILABLE", areaMarla: 7, priceAmount: "16500000000" },
  { id: "6", plotNo: "219", status: "BLOCKED", areaMarla: 10 },
  { id: "7", plotNo: "220", status: "AVAILABLE", areaMarla: 10, priceAmount: "25000000000" },
  { id: "8", plotNo: "221", status: "SOLD", areaMarla: 5 },
];

function formatPrice(paisa?: string) {
  if (!paisa) return "—";
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `${(pkr / 10_000_000).toFixed(1)} Cr`;
  if (pkr >= 100_000) return `${(pkr / 100_000).toFixed(0)} Lac`;
  return String(Math.round(pkr));
}

export default function MapScreen() {
  const [plots, setPlots] = useState<Plot[]>(DEMO_PLOTS);
  const [selected, setSelected] = useState<Plot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!API_URL) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/societies`)
      .then((r) => r.json())
      .then(async (list) => {
        const first = Array.isArray(list) ? list[0] : list?.items?.[0];
        if (!first?.id) return;
        const map = await fetch(`${API_URL}/api/v1/societies/${first.id}/map`).then((r) => r.json());
        if (map?.features) {
          setPlots(
            map.features.map((f: { properties: Plot & { plotNo?: string } }, i: number) => ({
              id: String(f.properties.id ?? i),
              plotNo: f.properties.plotNo ?? String(i),
              status: f.properties.status ?? "AVAILABLE",
              areaMarla: f.properties.areaMarla,
              priceAmount: f.properties.priceAmount,
            })),
          );
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.h1}>Society map</Text>
      <Text style={s.sub}>Master plan · plot inventory (demo grid)</Text>

      {loading ? <ActivityIndicator color="#0D6B5F" /> : null}

      <View style={s.legend}>
        {Object.entries(STATUS_COLOR).map(([k, c]) => (
          <View key={k} style={s.legItem}>
            <View style={[s.dot, { backgroundColor: c }]} />
            <Text style={s.legText}>{k}</Text>
          </View>
        ))}
      </View>

      <View style={s.grid}>
        {plots.map((p) => (
          <Pressable
            key={p.id}
            style={[s.plot, { backgroundColor: STATUS_COLOR[p.status] ?? "#4A5A55" }, selected?.id === p.id && s.plotOn]}
            onPress={() => setSelected(p)}
          >
            <Text style={s.plotNo}>{p.plotNo}</Text>
          </Pressable>
        ))}
      </View>

      {selected ? (
        <View style={s.card}>
          <Text style={s.cardTitle}>Plot {selected.plotNo}</Text>
          <Text style={s.cardMeta}>
            {selected.status} · {selected.areaMarla ?? "—"} Marla · {formatPrice(selected.priceAmount)}
          </Text>
        </View>
      ) : (
        <Text style={s.hint}>Plot select karo details ke liye</Text>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC", padding: 16 },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F1C19" },
  sub: { color: "#4A5A55", marginBottom: 12 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  legItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legText: { fontSize: 11, color: "#4A5A55" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  plot: {
    width: 72,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  plotOn: { borderWidth: 3, borderColor: "#0F1C19" },
  plotNo: { color: "#fff", fontWeight: "800", fontSize: 14 },
  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  cardTitle: { fontWeight: "800", fontSize: 16, color: "#0F1C19" },
  cardMeta: { color: "#4A5A55", marginTop: 4 },
  hint: { marginTop: 16, color: "#4A5A55", textAlign: "center" },
});
