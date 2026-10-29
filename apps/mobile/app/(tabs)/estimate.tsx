import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "../../lib/api";

const TYPES = ["GREY_STRUCTURE", "TURNKEY", "SEMI_FINISHED"] as const;
const QUALITY = ["ECONOMY", "STANDARD", "PREMIUM", "LUXURY"] as const;
const CITIES = ["Lahore", "Karachi", "Islamabad", "Multan"];

type Result = {
  total: { lowPkr: number; expectedPkr: number; highPkr: number; perSqftPkr: number };
  disclaimer: string;
  lineItems: { item: string; totalPkr: number }[];
};

function formatCr(n: number) {
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `PKR ${(n / 100_000).toFixed(1)} Lac`;
  return `PKR ${Math.round(n).toLocaleString()}`;
}

export default function EstimateScreen() {
  const [marla, setMarla] = useState(5);
  const [type, setType] = useState<(typeof TYPES)[number]>("GREY_STRUCTURE");
  const [quality, setQuality] = useState<(typeof QUALITY)[number]>("STANDARD");
  const [city, setCity] = useState("Lahore");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const localFallback = useMemo(() => {
    // offline approx if API down
    const sqft = marla * 225;
    const base = type === "TURNKEY" ? 5500 : type === "SEMI_FINISHED" ? 4200 : 3200;
    const q = { ECONOMY: 1, STANDARD: 1.18, PREMIUM: 1.42, LUXURY: 1.75 }[quality];
    const c = { Lahore: 1.08, Karachi: 1.12, Islamabad: 1.15, Multan: 1 }[city] ?? 1;
    const expected = sqft * base * q * c;
    return {
      total: {
        lowPkr: expected * 0.92,
        expectedPkr: expected,
        highPkr: expected * 1.12,
        perSqftPkr: expected / sqft,
      },
      disclaimer: "Offline estimate (approx). API connect hone par exact engine use hoga.",
      lineItems: [],
    };
  }, [marla, type, quality, city]);

  async function run() {
    setLoading(true);
    setError("");
    try {
      if (!API_URL) {
        setResult(localFallback);
        return;
      }
      const res = await fetch(`${API_URL}/api/v1/construction/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaValue: marla,
          areaUnit: "MARLA",
          floors: 1,
          constructionType: type,
          quality,
          city,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setResult(data);
    } catch {
      setResult(localFallback);
      setError("API offline — local estimate dikha rahe hain");
    } finally {
      setLoading(false);
    }
  }

  const show = result ?? null;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.h1}>Construction cost</Text>
        <Text style={s.sub}>Pakistan rates · range estimate</Text>

        <Text style={s.label}>Area (Marla)</Text>
        <View style={s.row}>
          {[3, 5, 7, 10, 20].map((n) => (
            <Pressable key={n} style={[s.chip, marla === n && s.chipOn]} onPress={() => setMarla(n)}>
              <Text style={[s.chipText, marla === n && s.chipTextOn]}>{n}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Type</Text>
        <View style={s.row}>
          {TYPES.map((t) => (
            <Pressable key={t} style={[s.chip, type === t && s.chipOn]} onPress={() => setType(t)}>
              <Text style={[s.chipText, type === t && s.chipTextOn]}>{t.replace("_", " ")}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Quality</Text>
        <View style={s.row}>
          {QUALITY.map((q) => (
            <Pressable key={q} style={[s.chip, quality === q && s.chipOn]} onPress={() => setQuality(q)}>
              <Text style={[s.chipText, quality === q && s.chipTextOn]}>{q}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>City</Text>
        <View style={s.row}>
          {CITIES.map((c) => (
            <Pressable key={c} style={[s.chip, city === c && s.chipOn]} onPress={() => setCity(c)}>
              <Text style={[s.chipText, city === c && s.chipTextOn]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={s.btn} onPress={run} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Estimate nikaalo</Text>}
        </Pressable>

        {error ? <Text style={s.warn}>{error}</Text> : null}

        {show ? (
          <View style={s.card}>
            <Text style={s.price}>{formatCr(show.total.expectedPkr)}</Text>
            <Text style={s.range}>
              {formatCr(show.total.lowPkr)} – {formatCr(show.total.highPkr)}
            </Text>
            <Text style={s.meta}>~PKR {Math.round(show.total.perSqftPkr).toLocaleString()} / sqft</Text>
            <Text style={s.disc}>{show.disclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  pad: { padding: 16, paddingBottom: 40 },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F1C19" },
  sub: { color: "#4A5A55", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#0A5148", marginTop: 12, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.15)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: "#0D6B5F", borderColor: "#0D6B5F" },
  chipText: { fontSize: 12, color: "#4A5A55" },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  btn: {
    marginTop: 20,
    backgroundColor: "#0D6B5F",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  price: { fontSize: 22, fontWeight: "800", color: "#0F1C19" },
  range: { color: "#4A5A55", marginTop: 4 },
  meta: { color: "#0D6B5F", marginTop: 8, fontWeight: "600" },
  disc: { fontSize: 12, color: "#4A5A55", marginTop: 12, lineHeight: 18 },
  warn: { color: "#B9551B", marginTop: 8, fontSize: 13 },
});
