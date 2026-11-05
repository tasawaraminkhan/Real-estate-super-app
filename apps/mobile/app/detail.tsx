import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";
import { propertiesApi, DEMO_LISTINGS, API_URL } from "../lib/api";
import { formatPriceFromPaisa } from "../lib/format";
import { openCall, openWhatsApp } from "../lib/contact";

const THUMB = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=480&fit=crop";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const demo = DEMO_LISTINGS.find((d) => d.id === id);
    if (demo) {
      setItem(demo as unknown as Record<string, unknown>);
      setLoading(false);
      return;
    }
    propertiesApi
      .list()
      .then((r) => {
        if (cancelled) return;
        const found = (r.items as { id: string }[]).find((x) => x.id === id);
        setItem((found as unknown as Record<string, unknown>) ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function fav() {
    if (!id) return;
    try {
      const res = await propertiesApi.toggleFavourite(id);
      Alert.alert(res.favourited ? "Saved" : "Removed", "Favourites updated.");
    } catch {
      Alert.alert("Saved", "Added to favourites.");
    }
  }

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen>
        <Pressable onPress={() => router.back()}>
          <Text style={s.back}>← Back</Text>
        </Pressable>
        <Text style={s.empty}>Listing not found</Text>
      </Screen>
    );
  }

  const city = (item.city as { name?: string } | undefined)?.name;
  const society = (item.society as { name?: string } | undefined)?.name;
  const title = String(item.title);
  const beds = item.bedrooms as number | undefined;
  const baths = item.bathrooms as number | undefined;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Image source={{ uri: THUMB }} style={s.hero} />
        <View style={s.body}>
          <Pressable onPress={() => router.back()}>
            <Text style={s.back}>← Back</Text>
          </Pressable>
          <Text style={s.price}>{formatPriceFromPaisa(String(item.priceAmount))}</Text>
          <Text style={s.title}>{title}</Text>
          <Text style={s.meta}>
            {String(item.areaValue)} {String(item.areaUnit)}
            {society ? ` · ${society}` : ""}
            {city ? ` · ${city}` : ""}
          </Text>
          <View style={s.row}>
            <View style={s.badge}>
              <Text style={s.badgeText}>{String(item.purpose ?? "SALE")}</Text>
            </View>
            {beds != null ? (
              <Text style={s.chip}>{beds} bed</Text>
            ) : null}
            {baths != null ? (
              <Text style={s.chip}>{baths} bath</Text>
            ) : null}
            {!API_URL ? <Text style={s.demo}>Sample listing</Text> : null}
          </View>

          <Text style={s.section}>About</Text>
          <Text style={s.about}>
            Verified-style listing on PropVerse. Schedule a visit via chat or request a masked call. Always
            confirm registry / fard and society NOC before payment — use Legal & Fraud Check from Home.
          </Text>

          <View style={s.actions}>
            <Pressable
              style={s.btn}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: { propertyId: id ?? "", title },
                })
              }
            >
              <Text style={s.btnText}>Chat</Text>
            </Pressable>
            <Pressable style={s.btnOutline} onPress={fav}>
              <Text style={s.btnOutlineText}>Save</Text>
            </Pressable>
          </View>
          <Pressable style={[s.btnOutline, { marginTop: 10 }]} onPress={() => openCall("+923001112233")}>
            <Text style={s.btnOutlineText}>Call (masked)</Text>
          </Pressable>
          <Pressable
            style={[s.btnOutline, { marginTop: 10, borderColor: colors.success }]}
            onPress={() => openWhatsApp("+923001112233", `Hi, interested in: ${title}`)}
          >
            <Text style={[s.btnOutlineText, { color: colors.success }]}>WhatsApp</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { width: "100%", height: 200, backgroundColor: "#D1D5DB" },
  body: { padding: space.lg },
  back: { color: colors.primary, fontWeight: "600", fontSize: 16, marginBottom: 8 },
  price: { fontSize: 26, fontWeight: "800", color: colors.primary },
  title: { fontSize: 18, color: colors.text, marginTop: 8, lineHeight: 26, fontWeight: "600" },
  meta: { color: colors.textMuted, marginTop: 6 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 12 },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },
  demo: { color: colors.orange, fontSize: 12, fontWeight: "600" },
  section: { marginTop: 20, fontWeight: "700", color: colors.text, fontSize: 15 },
  about: { marginTop: 8, color: colors.textSecondary, lineHeight: 22 },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  btn: { flex: 1, backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  btnOutlineText: { color: colors.primary, fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 40, color: colors.textMuted },
});
