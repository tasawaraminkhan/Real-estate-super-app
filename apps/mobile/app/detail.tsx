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
  Linking,
} from "react-native";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";
import { propertiesApi, DEMO_LISTINGS, API_URL } from "../lib/api";
import { formatPriceFromPaisa } from "../lib/format";

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
      Alert.alert("Saved", "Added to favourites (offline).");
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
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.empty}>Listing not found</Text>
      </Screen>
    );
  }

  const city = (item.city as { name?: string } | undefined)?.name;
  const society = (item.society as { name?: string } | undefined)?.name;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.price}>{formatPriceFromPaisa(String(item.priceAmount))}</Text>
        <Text style={s.title}>{String(item.title)}</Text>
        <Text style={s.meta}>
          {String(item.areaValue)} {String(item.areaUnit)}
          {society ? ` · ${society}` : ""}
          {city ? ` · ${city}` : ""}
        </Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{String(item.purpose ?? "SALE")}</Text>
        </View>
        {!API_URL ? <Text style={s.demo}>Demo listing</Text> : null}

        <View style={s.actions}>
          <Pressable
            style={s.btn}
            onPress={() =>
              router.push({
                pathname: "/chat",
                params: { propertyId: id ?? "", title: String(item.title ?? "Listing") },
              })
            }
          >
            <Text style={s.btnText}>Chat</Text>
          </Pressable>
          <Pressable style={s.btnOutline} onPress={fav}>
            <Text style={s.btnOutlineText}>Save</Text>
          </Pressable>
        </View>
        <Pressable
          style={[s.btnOutline, { marginTop: 12 }]}
          onPress={() =>
            Alert.alert(
              "Masked call",
              "In production a proxy number is issued so the seller’s real number stays private.",
            )
          }
        >
          <Text style={s.btnOutlineText}>Call (masked)</Text>
        </Pressable>
        <Pressable
          style={[s.btnOutline, { marginTop: 12, borderColor: colors.success }]}
          onPress={() => Linking.openURL("https://wa.me/923001234567")}
        >
          <Text style={[s.btnOutlineText, { color: colors.success }]}>WhatsApp</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600", fontSize: 16, marginBottom: 12 },
  price: { fontSize: 26, fontWeight: "800", color: colors.primary },
  title: { fontSize: 18, color: colors.textSecondary, marginTop: 8, lineHeight: 26 },
  meta: { color: colors.textMuted, marginTop: 8 },
  badge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  demo: { marginTop: 8, color: colors.orange, fontSize: 12 },
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
