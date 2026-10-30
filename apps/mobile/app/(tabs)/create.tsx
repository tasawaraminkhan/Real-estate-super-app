import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { StepBar } from "../../src/components/StepBar";
import { colors, space } from "../../src/theme/tokens";
import { propertiesApi } from "../../lib/api";

const PURPOSES = ["SALE", "RENT", "SHORT_STAY"] as const;
const TYPES: { id: (typeof TYPES_IDS)[number]; icon: string; label: string }[] = [
  { id: "PLOT", icon: "▭", label: "Plot" },
  { id: "HOUSE", icon: "⌂", label: "House" },
  { id: "FLAT", icon: "▦", label: "Flat" },
  { id: "SHOP", icon: "▣", label: "Shop" },
  { id: "OFFICE", icon: "▢", label: "Office" },
  { id: "VILLA", icon: "◈", label: "Villa" },
  { id: "FARMHOUSE", icon: "✤", label: "Farmhouse" },
  { id: "WAREHOUSE", icon: "▤", label: "Warehouse" },
];
type TYPES_IDS = "PLOT" | "HOUSE" | "FLAT" | "SHOP" | "OFFICE" | "VILLA" | "FARMHOUSE" | "WAREHOUSE";
const AREA_UNITS = ["MARLA", "KANAL", "SQFT", "SQYD"] as const;
const PRICE_UNITS = [
  { id: "LAC" as const, label: "Lac", toPaisa: (n: number) => Math.round(n * 100_000 * 100) },
  { id: "CR" as const, label: "Crore", toPaisa: (n: number) => Math.round(n * 10_000_000 * 100) },
  { id: "PKR" as const, label: "PKR (full)", toPaisa: (n: number) => Math.round(n * 100) },
];
const CITY_PRESETS = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Multan", "Faisalabad",
  "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur",
];
const STEP_LABELS = ["Type", "Location", "Price & size", "Review"];

export default function CreateScreen() {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]>("SALE");
  const [type, setType] = useState<TYPES_IDS>("PLOT");
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
      Alert.alert("City required", "Select a city or enter a custom city name.");
      return;
    }
    const num = parseFloat(priceValue || "0");
    if (!(num > 0)) {
      Alert.alert("Price required", "Enter a valid price.");
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
        title: title || `${area} ${areaUnit} ${type} — ${society || resolvedCity}`,
        description: [title || type, society && `Society: ${society}`, address && `Address: ${address}`, `City: ${resolvedCity}`]
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
      const status = (submitted as { property?: { status?: string } })?.property?.status ?? "ACTIVE";
      Alert.alert("Listing submitted", `ID: ${id}\n${resolvedCity} · ${area} ${areaUnit}\nStatus: ${status}`);
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
      Alert.alert("City", "Select a city or enter a custom name.");
      return;
    }
    if (step < 4) setStep(step + 1);
    else void finish();
  }

  const nextLabel =
    step === 1 ? "Next: Location" : step === 2 ? "Next: Price & size" : step === 3 ? "Next: Review" : "Submit listing";

  return (
    <Screen padded={false}>
      <View style={s.body}>
        <ScrollView
          contentContainerStyle={s.pad}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.h1}>Create Listing</Text>
          <StepBar step={step} total={4} labels={STEP_LABELS} />

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
              <Text style={s.label}>Property type</Text>
              <View style={s.typeGrid}>
                {TYPES.map((t) => (
                  <Pressable key={t.id} style={[s.typeCard, type === t.id && s.typeCardOn]} onPress={() => setType(t.id)}>
                    <Text style={s.typeIcon}>{t.icon}</Text>
                    <Text style={[s.typeLabel, type === t.id && s.typeLabelOn]}>{t.label}</Text>
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
                <Pressable style={[s.chip, useCustomCity && s.chipOn]} onPress={() => setUseCustomCity(true)}>
                  <Text style={[s.chipText, useCustomCity && s.chipTextOn]}>+ Custom</Text>
                </Pressable>
              </View>
              {useCustomCity ? (
                <TextInput
                  style={s.input}
                  placeholder="Enter city or town"
                  placeholderTextColor={colors.textMuted}
                  value={customCity}
                  onChangeText={setCustomCity}
                />
              ) : null}
              <Text style={s.label}>Society / project (optional)</Text>
              <TextInput style={s.input} placeholder="e.g. DHA Phase 5" placeholderTextColor={colors.textMuted} value={society} onChangeText={setSociety} />
              <Text style={s.label}>Title</Text>
              <TextInput style={s.input} placeholder="e.g. Corner 5 Marla plot" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} />
              <Text style={s.label}>Address (optional)</Text>
              <TextInput style={s.input} placeholder="Block / street / landmark" placeholderTextColor={colors.textMuted} value={address} onChangeText={setAddress} />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={s.label}>Area value</Text>
              <TextInput style={s.input} keyboardType="decimal-pad" value={area} onChangeText={setArea} placeholder="e.g. 5 or 12.5" placeholderTextColor={colors.textMuted} />
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
                placeholder={priceUnit === "LAC" ? "e.g. 245" : priceUnit === "CR" ? "e.g. 2.45" : "e.g. 24500000"}
                placeholderTextColor={colors.textMuted}
                value={priceValue}
                onChangeText={setPriceValue}
              />
              <Text style={s.label}>Price unit</Text>
              <View style={s.row}>
                {PRICE_UNITS.map((u) => (
                  <Pressable key={u.id} style={[s.chip, priceUnit === u.id && s.chipOn]} onPress={() => setPriceUnit(u.id)}>
                    <Text style={[s.chipText, priceUnit === u.id && s.chipTextOn]}>{u.label}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={s.hint}>Lac = 100,000 PKR · Crore = 10,000,000 PKR · Full = exact rupees</Text>
            </>
          )}

          {step === 4 && (
            <View style={s.card}>
              <Text style={s.previewTitle}>Review</Text>
              <Text style={s.previewLine}>{purpose.replace("_", " ")} · {type}</Text>
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
          <View style={{ height: 88 }} />
        </ScrollView>

        <View style={s.footer}>
          {step > 1 ? (
            <Pressable style={s.btnGhost} onPress={() => setStep(step - 1)}>
              <Text style={s.btnGhostText}>Back</Text>
            </Pressable>
          ) : (
            <View style={{ width: 72 }} />
          )}
          <Pressable style={s.btnPrimary} onPress={next} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnPrimaryText}>{nextLabel}</Text>}
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  body: { flex: 1 },
  pad: { paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: 16 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 4 },
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
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    width: "22%",
    minWidth: 72,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  typeCardOn: { borderColor: colors.primary, backgroundColor: "#E6F4F1" },
  typeIcon: { fontSize: 22, marginBottom: 4 },
  typeLabel: { fontSize: 11, fontWeight: "600", color: colors.textMuted },
  typeLabelOn: { color: colors.primary },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 10, lineHeight: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewTitle: { fontWeight: "700", marginBottom: 8, color: colors.primary },
  previewLine: { color: colors.textSecondary, marginBottom: 4 },
  previewPrice: { fontSize: 20, fontWeight: "800", marginTop: 8, color: colors.text },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
  },
  btnGhost: { paddingVertical: 14, paddingHorizontal: 8 },
  btnGhostText: { color: colors.primary, fontWeight: "600" },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
