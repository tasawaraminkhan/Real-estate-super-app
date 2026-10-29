import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { API_URL } from "../../lib/api";

const TYPES = ["GREY_STRUCTURE", "TURNKEY", "SEMI_FINISHED"] as const;
const QUALITY = ["ECONOMY", "STANDARD", "PREMIUM", "LUXURY"] as const;
const AREA_UNITS = ["MARLA", "KANAL", "SQFT"] as const;
const CITY_PRESETS = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Multan",
  "Faisalabad",
  "Peshawar",
  "Quetta",
];

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
  const [areaValue, setAreaValue] = useState("5");
  const [areaUnit, setAreaUnit] = useState<(typeof AREA_UNITS)[number]>("MARLA");
  const [floors, setFloors] = useState("1");
  const [type, setType] = useState<(typeof TYPES)[number]>("GREY_STRUCTURE");
  const [quality, setQuality] = useState<(typeof QUALITY)[number]>("STANDARD");
  const [city, setCity] = useState("Lahore");
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const resolvedCity = useCustomCity ? customCity.trim() || "DEFAULT" : city;
  const areaNum = parseFloat(areaValue) || 1;
  const floorsNum = Math.max(1, parseInt(floors, 10) || 1);

  const localFallback = useMemo(() => {
    const sqft =
      areaUnit === "MARLA"
        ? areaNum * 225
        : areaUnit === "KANAL"
          ? areaNum * 4500
          : areaNum;
    const base = type === "TURNKEY" ? 5500 : type === "SEMI_FINISHED" ? 4200 : 3200;
    const q = { ECONOMY: 1, STANDARD: 1.18, PREMIUM: 1.42, LUXURY: 1.75 }[quality];
    const cityMult: Record<string, number> = {
      Lahore: 1.08,
      Karachi: 1.12,
      Islamabad: 1.15,
      Rawalpindi: 1.1,
      Multan: 1.0,
      Faisalabad: 1.03,
      Peshawar: 1.02,
      Quetta: 1.05,
    };
    const c = cityMult[resolvedCity] ?? 1.0;
    const expected = sqft * floorsNum * base * q * c;
    return {
      total: {
        lowPkr: expected * 0.92,
        expectedPkr: expected,
        highPkr: expected * 1.12,
        perSqftPkr: expected / Math.max(1, sqft * floorsNum),
      },
      disclaimer: "Offline estimate. API par exact engine + city rates use honge.",
      lineItems: [],
    };
  }, [areaNum, areaUnit, floorsNum, type, quality, resolvedCity]);

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
          areaValue: areaNum,
          areaUnit,
          floors: floorsNum,
          constructionType: type,
          quality,
          city: resolvedCity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setResult(data);
    } catch {
      setResult(localFallback);
      setError("API offline — local estimate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
        <Text style={s.h1}>Construction cost</Text>
        <Text style={s.sub}>Custom area · city · floors</Text>

        <Text style={s.label}>Area</Text>
        <TextInput
          style={s.input}
          keyboardType="decimal-pad"
          value={areaValue}
          onChangeText={setAreaValue}
          placeholder="e.g. 5 or 12.5"
          placeholderTextColor="#4A5A55"
        />
        <View style={s.row}>
          {AREA_UNITS.map((u) => (
            <Pressable key={u} style={[s.chip, areaUnit === u && s.chipOn]} onPress={() => setAreaUnit(u)}>
              <Text style={[s.chipText, areaUnit === u && s.chipTextOn]}>{u}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Floors</Text>
        <TextInput
          style={s.input}
          keyboardType="number-pad"
          value={floors}
          onChangeText={setFloors}
          placeholder="1"
          placeholderTextColor="#4A5A55"
        />

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
          {CITY_PRESETS.map((c) => (
            <Pressable
              key={c}
              style={[s.chip, !useCustomCity && city === c && s.chipOn]}
              onPress={() => {
                setCity(c);
                setUseCustomCity(false);
              }}
            >
              <Text style={[s.chipText, !useCustomCity && city === c && s.chipTextOn]}>{c}</Text>
            </Pressable>
          ))}
          <Pressable style={[s.chip, useCustomCity && s.chipOn]} onPress={() => setUseCustomCity(true)}>
            <Text style={[s.chipText, useCustomCity && s.chipTextOn]}>+ Custom</Text>
          </Pressable>
        </View>
        {useCustomCity ? (
          <TextInput
            style={s.input}
            placeholder="City / town name"
            placeholderTextColor="#4A5A55"
            value={customCity}
            onChangeText={setCustomCity}
          />
        ) : null}

        <Pressable style={s.btn} onPress={run} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Estimate nikaalo</Text>}
        </Pressable>
        {error ? <Text style={s.warn}>{error}</Text> : null}

        {result ? (
          <View style={s.card}>
            <Text style={s.price}>{formatCr(result.total.expectedPkr)}</Text>
            <Text style={s.range}>
              {formatCr(result.total.lowPkr)} – {formatCr(result.total.highPkr)}
            </Text>
            <Text style={s.meta}>~PKR {Math.round(result.total.perSqftPkr).toLocaleString()} / sqft</Text>
            <Text style={s.disc}>{result.disclaimer}</Text>
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.13)",
    padding: 14,
    fontSize: 16,
    color: "#0F1C19",
  },
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
