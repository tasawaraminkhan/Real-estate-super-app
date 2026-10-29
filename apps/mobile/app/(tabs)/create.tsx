import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { propertiesApi } from "../../lib/api";

const PURPOSES = ["SALE", "RENT", "SHORT_STAY"] as const;
const TYPES = ["PLOT", "HOUSE", "FLAT", "SHOP", "OFFICE", "VILLA", "FARMHOUSE", "WAREHOUSE"] as const;
const AREA_UNITS = ["MARLA", "KANAL", "SQFT", "SQYD"] as const;
const PRICE_UNITS = [
  { id: "LAC", label: "Lac", toPaisa: (n: number) => Math.round(n * 100_000 * 100) },
  { id: "CR", label: "Crore", toPaisa: (n: number) => Math.round(n * 10_000_000 * 100) },
  { id: "PKR", label: "PKR (full)", toPaisa: (n: number) => Math.round(n * 100) },
] as const;
const CITY_PRESETS = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Multan",
  "Faisalabad",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
];

export default function CreateScreen() {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]>("SALE");
  const [type, setType] = useState<(typeof TYPES)[number]>("PLOT");
  const [title, setTitle] = useState("");
  const [society, setSociety] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("5");
  const [areaUnit, setAreaUnit] = useState<(typeof AREA_UNITS)[number]>("MARLA");
  const [priceValue, setPriceValue] = useState("");
  const [priceUnit, setPriceUnit] = useState<"LAC" | "CR" | "PKR">("LAC");
  const [city, setCity] = useState("Lahore");
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [loading, setLoading] = useState(false);

  const resolvedCity = useCustomCity ? customCity.trim() : city;

  async function finish() {
    if (!resolvedCity) {
      Alert.alert("City required", "City select karo ya custom likho");
      return;
    }
    const num = parseFloat(priceValue || "0");
    if (!(num > 0)) {
      Alert.alert("Price required", "Valid price enter karo");
      return;
    }
    setLoading(true);
    try {
      const unit = PRICE_UNITS.find((u) => u.id === priceUnit)!;
      const priceAmount = unit.toPaisa(num);
      const draft = await propertiesApi.createDraft({
        purpose,
        category: ["SHOP", "OFFICE", "WAREHOUSE"].includes(type) ? "COMMERCIAL" : "RESIDENTIAL",
        type,
        title:
          title ||
          `${area} ${areaUnit} ${type} — ${society || resolvedCity}`,
        description: [
          title || type,
          society ? `Society: ${society}` : null,
          address ? `Address: ${address}` : null,
          `City: ${resolvedCity}`,
        ]
          .filter(Boolean)
          .join(". "),
        areaValue: parseFloat(area) || 1,
        areaUnit,
        priceAmount,
        currency: "PKR",
        priceType: "NEGOTIABLE",
        addressText: address || undefined,
      });
      const id = String((draft as { id?: string }).id ?? "demo");
      const submitted = await propertiesApi.submit(id);
      const status =
        (submitted as { property?: { status?: string } })?.property?.status ?? "ACTIVE";
      const fraud =
        (submitted as { fraud?: { action?: string; score?: number } })?.fraud ?? {};
      Alert.alert(
        "Listing submitted",
        `ID: ${id}\n${resolvedCity} · ${area} ${areaUnit}\n${priceValue} ${priceUnit}\nStatus: ${status}\nFraud: ${fraud.action ?? "n/a"} (${fraud.score ?? 0})`,
      );
      setStep(1);
      setTitle("");
      setPriceValue("");
      setSociety("");
      setAddress("");
    } catch (e) {
      Alert.alert("Error", JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step === 2 && !resolvedCity) {
      Alert.alert("City", "City chip select karo ya Custom city likho");
      return;
    }
    if (step < 4) setStep(step + 1);
    else void finish();
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
        <Text style={s.h1}>Listing daalo</Text>
        <Text style={s.sub}>Step {step} / 4 · Pakistan-wide</Text>

        {step === 1 && (
          <>
            <Text style={s.label}>Purpose</Text>
            <View style={s.row}>
              {PURPOSES.map((p) => (
                <Pressable key={p} style={[s.chip, purpose === p && s.chipOn]} onPress={() => setPurpose(p)}>
                  <Text style={[s.chipText, purpose === p && s.chipTextOn]}>{p.replace("_", " ")}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.label}>Type</Text>
            <View style={s.row}>
              {TYPES.map((t) => (
                <Pressable key={t} style={[s.chip, type === t && s.chipOn]} onPress={() => setType(t)}>
                  <Text style={[s.chipText, type === t && s.chipTextOn]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
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
              <Pressable
                style={[s.chip, useCustomCity && s.chipOn]}
                onPress={() => setUseCustomCity(true)}
              >
                <Text style={[s.chipText, useCustomCity && s.chipTextOn]}>+ Custom</Text>
              </Pressable>
            </View>
            {useCustomCity ? (
              <TextInput
                style={s.input}
                placeholder="Apna city / town likho (e.g. Okara, Mardan)"
                placeholderTextColor="#4A5A55"
                value={customCity}
                onChangeText={setCustomCity}
                autoFocus
              />
            ) : null}

            <Text style={s.label}>Society / project (optional)</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. DHA Phase 5, Bahria Town"
              placeholderTextColor="#4A5A55"
              value={society}
              onChangeText={setSociety}
            />
            <Text style={s.label}>Title</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. Corner 5 Marla plot main boulevard"
              placeholderTextColor="#4A5A55"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={s.label}>Address (optional)</Text>
            <TextInput
              style={s.input}
              placeholder="Block / street / near landmark"
              placeholderTextColor="#4A5A55"
              value={address}
              onChangeText={setAddress}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={s.label}>Area value</Text>
            <TextInput
              style={s.input}
              keyboardType="decimal-pad"
              value={area}
              onChangeText={setArea}
              placeholder="e.g. 5 or 12.5"
              placeholderTextColor="#4A5A55"
            />
            <Text style={s.label}>Area unit</Text>
            <View style={s.row}>
              {AREA_UNITS.map((u) => (
                <Pressable key={u} style={[s.chip, areaUnit === u && s.chipOn]} onPress={() => setAreaUnit(u)}>
                  <Text style={[s.chipText, areaUnit === u && s.chipTextOn]}>{u}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={s.label}>Price amount</Text>
            <TextInput
              style={s.input}
              keyboardType="decimal-pad"
              placeholder={
                priceUnit === "LAC"
                  ? "e.g. 245"
                  : priceUnit === "CR"
                    ? "e.g. 2.45"
                    : "e.g. 24500000"
              }
              placeholderTextColor="#4A5A55"
              value={priceValue}
              onChangeText={setPriceValue}
            />
            <Text style={s.label}>Price unit</Text>
            <View style={s.row}>
              {PRICE_UNITS.map((u) => (
                <Pressable
                  key={u.id}
                  style={[s.chip, priceUnit === u.id && s.chipOn]}
                  onPress={() => setPriceUnit(u.id)}
                >
                  <Text style={[s.chipText, priceUnit === u.id && s.chipTextOn]}>{u.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.hint}>
              Lac = 1,00,000 PKR · Crore = 1,00,00,000 PKR · Full = exact rupees
            </Text>
          </>
        )}

        {step === 4 && (
          <View style={s.card}>
            <Text style={s.previewTitle}>Preview & submit</Text>
            <Text style={s.previewLine}>
              {purpose.replace("_", " ")} · {type}
            </Text>
            <Text style={s.previewLine}>{title || "—"}</Text>
            <Text style={s.previewLine}>
              {area} {areaUnit}
              {society ? ` · ${society}` : ""} · {resolvedCity}
            </Text>
            {address ? <Text style={s.previewLine}>{address}</Text> : null}
            <Text style={s.previewPrice}>
              {priceValue || "—"} {PRICE_UNITS.find((u) => u.id === priceUnit)?.label}
            </Text>
          </View>
        )}

        <View style={s.nav}>
          {step > 1 ? (
            <Pressable style={s.btnGhost} onPress={() => setStep(step - 1)}>
              <Text style={s.btnGhostText}>Back</Text>
            </Pressable>
          ) : (
            <View />
          )}
          <Pressable style={s.btn} onPress={next} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.btnText}>{step === 4 ? "Submit" : "Aage"}</Text>
            )}
          </Pressable>
        </View>
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
    marginTop: 4,
  },
  hint: { fontSize: 12, color: "#4A5A55", marginTop: 10, lineHeight: 18 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  previewTitle: { fontWeight: "700", marginBottom: 8, color: "#0D6B5F" },
  previewLine: { color: "#1D2E29", marginBottom: 4 },
  previewPrice: { fontSize: 20, fontWeight: "800", marginTop: 8, color: "#0F1C19" },
  nav: { flexDirection: "row", justifyContent: "space-between", marginTop: 24, alignItems: "center" },
  btn: {
    backgroundColor: "#0D6B5F",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    minWidth: 100,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnGhost: { padding: 14 },
  btnGhostText: { color: "#0D6B5F", fontWeight: "600" },
});
