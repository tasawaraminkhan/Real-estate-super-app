import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";
import { API_URL } from "../../lib/api";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TYPES = ["GREY_STRUCTURE", "TURNKEY", "SEMI_FINISHED"] as const;
const QUALITY = ["ECONOMY", "STANDARD", "PREMIUM", "LUXURY"] as const;
const AREA_UNITS = ["MARLA", "KANAL", "SQFT"] as const;
const CITY_PRESETS = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Multan", "Faisalabad",
  "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur",
];
const AREA_PILLS = [3, 5, 7, 10, 20];

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
  const [cityQuery, setCityQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [breakdownOpen, setBreakdownOpen] = useState(true);

  const resolvedCity = useCustomCity ? customCity.trim() || "DEFAULT" : city;
  const areaNum = parseFloat(areaValue) || 1;
  const floorsNum = Math.max(1, parseInt(floors, 10) || 1);
  const filteredCities = CITY_PRESETS.filter((c) =>
    c.toLowerCase().includes(cityQuery.trim().toLowerCase()),
  );

  const localFallback = useMemo(() => {
    const sqft = areaUnit === "MARLA" ? areaNum * 225 : areaUnit === "KANAL" ? areaNum * 4500 : areaNum;
    const base = type === "TURNKEY" ? 5500 : type === "SEMI_FINISHED" ? 4200 : 3200;
    const q = { ECONOMY: 1, STANDARD: 1.18, PREMIUM: 1.42, LUXURY: 1.75 }[quality];
    const cityMult: Record<string, number> = {
      Lahore: 1.08, Karachi: 1.12, Islamabad: 1.15, Rawalpindi: 1.1, Multan: 1, Faisalabad: 1.03, Peshawar: 1.02, Quetta: 1.05,
    };
    const c = cityMult[resolvedCity] ?? 1;
    const expected = sqft * floorsNum * base * q * c;
    return {
      total: {
        lowPkr: expected * 0.92,
        expectedPkr: expected,
        highPkr: expected * 1.12,
        perSqftPkr: expected / Math.max(1, sqft * floorsNum),
      },
      disclaimer: "Estimate based on sample 2025 rates. Verify with local contractors.",
      lineItems: [
        { item: "Grey structure materials", totalPkr: expected * 0.45 },
        { item: "Finishing (if applicable)", totalPkr: expected * 0.3 },
        { item: "Labour", totalPkr: expected * 0.25 },
      ],
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
      setResult({
        ...data,
        lineItems: data.lineItems?.length
          ? data.lineItems.map((l: { item: string; totalPkr: number }) => ({
              item: l.item,
              totalPkr: l.totalPkr,
            }))
          : localFallback.lineItems,
      });
    } catch {
      setResult(localFallback);
      setError("Showing offline estimate");
    } finally {
      setLoading(false);
      setBreakdownOpen(true);
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40, paddingTop: space.sm }}>
        <Text style={s.h1}>Construction Cost</Text>
        <Text style={s.sub}>Custom area, city, and quality</Text>

        <Text style={s.label}>Area</Text>
        <View style={s.row}>
          {AREA_PILLS.map((n) => (
            <Pressable
              key={n}
              style={[s.chip, areaValue === String(n) && s.chipOn]}
              onPress={() => setAreaValue(String(n))}
            >
              <Text style={[s.chipText, areaValue === String(n) && s.chipTextOn]}>{n}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={s.input}
          keyboardType="decimal-pad"
          value={areaValue}
          onChangeText={setAreaValue}
          placeholder="Custom area (e.g. 2.5 or 12)"
          placeholderTextColor={colors.textMuted}
        />
        <View style={[s.row, { marginTop: 8 }]}>
          {AREA_UNITS.map((u) => (
            <Pressable key={u} style={[s.chip, areaUnit === u && s.chipOn]} onPress={() => setAreaUnit(u)}>
              <Text style={[s.chipText, areaUnit === u && s.chipTextOn]}>{u}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={s.label}>Floors</Text>
        <TextInput style={s.input} keyboardType="number-pad" value={floors} onChangeText={setFloors} placeholder="1" placeholderTextColor={colors.textMuted} />

        <Text style={s.label}>Construction type</Text>
        <View style={s.row}>
          {TYPES.map((t) => (
            <Pressable key={t} style={[s.chip, type === t && s.chipOn]} onPress={() => setType(t)}>
              <Text style={[s.chipText, type === t && s.chipTextOn]}>{t.replace(/_/g, " ")}</Text>
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
        <TextInput
          style={s.input}
          value={cityQuery}
          onChangeText={setCityQuery}
          placeholder="Search city..."
          placeholderTextColor={colors.textMuted}
        />
        <View style={s.row}>
          {filteredCities.slice(0, 10).map((c) => (
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
            placeholder="Enter city or town name"
            placeholderTextColor={colors.textMuted}
            value={customCity}
            onChangeText={setCustomCity}
          />
        ) : null}

        <Pressable style={s.btn} onPress={run} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Calculate Cost</Text>}
        </Pressable>
        {error ? <Text style={s.warn}>{error}</Text> : null}

        {result ? (
          <View style={s.card}>
            <Text style={s.price}>{formatCr(result.total.expectedPkr)}</Text>
            <Text style={s.range}>
              {formatCr(result.total.lowPkr)} – {formatCr(result.total.highPkr)}
            </Text>
            <Text style={s.meta}>~PKR {Math.round(result.total.perSqftPkr).toLocaleString()} / sq.ft</Text>

            <Pressable
              style={s.accordionHead}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setBreakdownOpen((o) => !o);
              }}
            >
              <Text style={s.accordionTitle}>Cost breakdown</Text>
              <Text style={s.accordionChevron}>{breakdownOpen ? "−" : "+"}</Text>
            </Pressable>
            {breakdownOpen
              ? (result.lineItems?.length ? result.lineItems : localFallback.lineItems).map((l) => (
                  <View key={l.item} style={s.lineRow}>
                    <Text style={s.lineItem}>{l.item.replace(/_/g, " ")}</Text>
                    <Text style={s.lineVal}>{formatCr(l.totalPkr)}</Text>
                  </View>
                ))
              : null}
            <Text style={s.disc}>{result.disclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: "800", color: colors.text },
  sub: { color: colors.textMuted, marginBottom: space.md },
  label: { fontSize: 13, fontWeight: "600", color: colors.primaryDark, marginTop: space.md, marginBottom: space.sm },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginTop: 6,
  },
  btn: {
    marginTop: space.xl,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  card: {
    marginTop: space.lg,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  price: { fontSize: 22, fontWeight: "800", color: colors.text },
  range: { color: colors.textMuted, marginTop: 4 },
  meta: { color: colors.primary, marginTop: 8, fontWeight: "600" },
  accordionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  accordionTitle: { fontWeight: "700", color: colors.text },
  accordionChevron: { fontWeight: "700", color: colors.primary, fontSize: 18 },
  lineRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  lineItem: { color: colors.textSecondary, flex: 1, textTransform: "capitalize" },
  lineVal: { fontWeight: "600", color: colors.text },
  disc: { fontSize: 12, color: colors.textMuted, marginTop: 14, lineHeight: 18 },
  warn: { color: colors.orange, marginTop: 8, fontSize: 13 },
});
