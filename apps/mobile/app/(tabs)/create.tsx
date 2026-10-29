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

const PURPOSES = ["SALE", "RENT"] as const;
const TYPES = ["PLOT", "HOUSE", "FLAT", "SHOP"] as const;

export default function CreateScreen() {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState<"SALE" | "RENT">("SALE");
  const [type, setType] = useState<(typeof TYPES)[number]>("PLOT");
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("5");
  const [priceLac, setPriceLac] = useState("");
  const [city, setCity] = useState("Lahore");
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    try {
      const lac = parseFloat(priceLac || "0");
      const priceAmount = Math.round(lac * 100_000 * 100); // lac → paisa
      const draft = await propertiesApi.createDraft({
        purpose,
        category: type === "SHOP" ? "COMMERCIAL" : "RESIDENTIAL",
        type,
        title: title || `${area} Marla ${type} — ${city}`,
        description: `${title || type} in ${city}. Listed via PropVerse mobile.`,
        areaValue: parseFloat(area) || 5,
        areaUnit: "MARLA",
        priceAmount,
        currency: "PKR",
        priceType: "NEGOTIABLE",
      });
      const id = String((draft as { id?: string }).id ?? "demo");
      const submitted = await propertiesApi.submit(id);
      Alert.alert(
        "Listing submitted",
        `ID: ${id}\nStatus: ${(submitted as { property?: { status?: string } })?.property?.status ?? "ACTIVE"}\nFraud: ${JSON.stringify((submitted as { fraud?: { action?: string } })?.fraud?.action ?? "n/a")}`,
      );
      setStep(1);
      setTitle("");
      setPriceLac("");
    } catch (e) {
      Alert.alert("Error", JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step < 4) setStep(step + 1);
    else void finish();
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.h1}>Listing daalo</Text>
        <Text style={s.sub}>Step {step} / 4</Text>

        {step === 1 && (
          <>
            <Text style={s.label}>Purpose</Text>
            <View style={s.row}>
              {PURPOSES.map((p) => (
                <Pressable key={p} style={[s.chip, purpose === p && s.chipOn]} onPress={() => setPurpose(p)}>
                  <Text style={[s.chipText, purpose === p && s.chipTextOn]}>{p}</Text>
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
              {["Lahore", "Karachi", "Islamabad"].map((c) => (
                <Pressable key={c} style={[s.chip, city === c && s.chipOn]} onPress={() => setCity(c)}>
                  <Text style={[s.chipText, city === c && s.chipTextOn]}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.label}>Title</Text>
            <TextInput
              style={s.input}
              placeholder="e.g. 5 Marla plot DHA Phase 5"
              placeholderTextColor="#4A5A55"
              value={title}
              onChangeText={setTitle}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={s.label}>Area (Marla)</Text>
            <TextInput style={s.input} keyboardType="decimal-pad" value={area} onChangeText={setArea} />
            <Text style={s.label}>Price (Lac PKR)</Text>
            <TextInput
              style={s.input}
              keyboardType="decimal-pad"
              placeholder="e.g. 245"
              placeholderTextColor="#4A5A55"
              value={priceLac}
              onChangeText={setPriceLac}
            />
          </>
        )}

        {step === 4 && (
          <View style={s.card}>
            <Text style={s.previewTitle}>Preview & submit</Text>
            <Text style={s.previewLine}>{purpose} · {type}</Text>
            <Text style={s.previewLine}>{title || "—"}</Text>
            <Text style={s.previewLine}>{area} Marla · {city}</Text>
            <Text style={s.previewPrice}>PKR {priceLac || "—"} Lac</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipOn: { backgroundColor: "#0D6B5F", borderColor: "#0D6B5F" },
  chipText: { fontSize: 13, color: "#4A5A55" },
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
  btn: { backgroundColor: "#0D6B5F", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, minWidth: 100, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnGhost: { padding: 14 },
  btnGhostText: { color: "#0D6B5F", fontWeight: "600" },
});
