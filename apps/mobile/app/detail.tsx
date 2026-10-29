import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { propertiesApi, DEMO_LISTINGS, API_URL } from "../lib/api";

function formatPrice(paisa: string) {
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  if (pkr >= 100_000) return `PKR ${(pkr / 100_000).toFixed(1)} Lac`;
  return `PKR ${Math.round(pkr).toLocaleString()}`;
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const demo = DEMO_LISTINGS.find((d) => d.id === id);
    if (demo) {
      setItem(demo as unknown as Record<string, unknown>);
      setLoading(false);
      return;
    }
    propertiesApi
      .list()
      .then((r) => {
        const found = (r.items as { id: string }[]).find((x) => x.id === id);
        setItem((found as unknown as Record<string, unknown>) ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function fav() {
    if (!id) return;
    const res = await propertiesApi.toggleFavourite(id);
    Alert.alert(res.favourited ? "Saved" : "Removed", "Favourites updated");
  }

  function chat() {
    router.push({ pathname: "/chat", params: { propertyId: id ?? "", title: String(item?.title ?? "Listing") } });
  }

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator color="#0D6B5F" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={s.safe}>
        <Pressable onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← Back</Text>
        </Pressable>
        <Text style={s.empty}>Listing nahi mili</Text>
      </SafeAreaView>
    );
  }

  const city = (item.city as { name?: string } | undefined)?.name;
  const society = (item.society as { name?: string } | undefined)?.name;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← Back</Text>
        </Pressable>
        <View style={s.body}>
          <Text style={s.price}>{formatPrice(String(item.priceAmount))}</Text>
          <Text style={s.title}>{String(item.title)}</Text>
          <Text style={s.meta}>
            {String(item.areaValue)} {String(item.areaUnit)}
            {society ? ` · ${society}` : ""}
            {city ? ` · ${city}` : ""}
          </Text>
          <Text style={s.badge}>{String(item.purpose ?? "SALE")}</Text>
          {!API_URL ? <Text style={s.demo}>Demo listing</Text> : null}

          <View style={s.actions}>
            <Pressable style={s.btn} onPress={chat}>
              <Text style={s.btnText}>Chat</Text>
            </Pressable>
            <Pressable style={s.btnOutline} onPress={fav}>
              <Text style={s.btnOutlineText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  back: { padding: 16 },
  backText: { color: "#0D6B5F", fontWeight: "600", fontSize: 16 },
  body: { paddingHorizontal: 16 },
  price: { fontSize: 26, fontWeight: "800", color: "#0F1C19" },
  title: { fontSize: 18, color: "#1D2E29", marginTop: 8, lineHeight: 26 },
  meta: { color: "#4A5A55", marginTop: 8 },
  badge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#0D6B5F",
    color: "#fff",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "700",
  },
  demo: { marginTop: 8, color: "#B9551B", fontSize: 12 },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  btn: {
    flex: 1,
    backgroundColor: "#0D6B5F",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#0D6B5F",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  btnOutlineText: { color: "#0D6B5F", fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 40, color: "#4A5A55" },
});
