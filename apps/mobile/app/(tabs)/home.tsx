import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";
import { propertiesApi, API_URL } from "../../lib/api";

type Item = {
  id: string;
  title: string;
  priceAmount: string;
  areaValue: number;
  areaUnit: string;
  purpose?: string;
  bedrooms?: number;
  bathrooms?: number;
  city?: { name: string };
  society?: { name?: string };
};

function formatPrice(paisa: string) {
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  if (pkr >= 100_000) return `PKR ${(pkr / 100_000).toFixed(1)} Lac`;
  return `PKR ${Math.round(pkr).toLocaleString()}`;
}

const CATEGORIES = [
  { id: "ALL", label: "All" },
  { id: "SALE", label: "Buy" },
  { id: "RENT", label: "Rent" },
  { id: "COMMERCIAL", label: "Commercial" },
] as const;

const PRICE_FILTERS = [
  { id: "ALL", label: "Any price" },
  { id: "0-50", label: "< 50 Lac", max: 50_00_000_00 },
  { id: "50-100", label: "50–100 Lac", min: 50_00_000_00, max: 100_00_000_00 },
  { id: "100-300", label: "1–3 Cr", min: 100_00_000_00, max: 300_00_000_00 },
  { id: "300+", label: "3 Cr+", min: 300_00_000_00 },
];

const WIDGETS = [
  { id: "legal", title: "Legal & Fraud Check", route: "/legal-check", color: "#1D4ED8" },
  { id: "escrow", title: "Escrow Safe Deal", route: "/escrow", color: colors.primary },
  { id: "materials", title: "Cost & Materials", route: "/materials", color: colors.warning },
  { id: "invest", title: "Fractional Invest", route: "/invest", color: "#7C3AED" },
  { id: "labour", title: "Labour Market", route: "/labour", color: colors.success },
];

const THUMBS = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=160&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=160&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=160&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&h=160&fit=crop",
];

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("ALL");
  const [priceId, setPriceId] = useState("ALL");
  const [q, setQ] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    propertiesApi
      .list()
      .then((r) => {
        let list = r.items as Item[];
        if (category === "SALE" || category === "RENT") {
          list = list.filter((i) => (i.purpose ?? "SALE") === category);
        }
        if (category === "COMMERCIAL") {
          list = list.filter((i) => /shop|office|warehouse|commercial/i.test(i.title));
        }
        const pf = PRICE_FILTERS.find((p) => p.id === priceId);
        if (pf && pf.id !== "ALL") {
          list = list.filter((i) => {
            const n = Number(i.priceAmount);
            if (pf.min != null && n < pf.min) return false;
            if (pf.max != null && n > pf.max) return false;
            return true;
          });
        }
        if (q.trim()) {
          const qq = q.toLowerCase();
          list = list.filter(
            (i) =>
              i.title.toLowerCase().includes(qq) ||
              i.city?.name?.toLowerCase().includes(qq) ||
              i.society?.name?.toLowerCase().includes(qq),
          );
        }
        setItems(list);
      })
      .finally(() => setLoading(false));
  }, [category, q, priceId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen padded={false}>
      <View style={s.header}>
        <View>
          <Text style={s.logo}>PropVerse</Text>
          <Text style={s.tagline}>Pakistan real estate</Text>
        </View>
        <Pressable onPress={() => router.push("/profile")} hitSlop={12}>
          <Text style={s.profile}>Profile</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={s.searchBox}>
          <TextInput
            style={s.search}
            placeholder="Search city, society, DHA..."
            placeholderTextColor={colors.textMuted}
            value={q}
            onChangeText={setQ}
            onSubmitEditing={load}
            returnKeyType="search"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
          {CATEGORIES.map((c) => (
            <Pressable key={c.id} style={[s.chip, category === c.id && s.chipOn]} onPress={() => setCategory(c.id)}>
              <Text style={[s.chipText, category === c.id && s.chipTextOn]}>{c.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
          {PRICE_FILTERS.map((p) => (
            <Pressable key={p.id} style={[s.chip, priceId === p.id && s.chipOn]} onPress={() => setPriceId(p.id)}>
              <Text style={[s.chipText, priceId === p.id && s.chipTextOn]}>{p.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={s.section}>Quick tools</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.widgets}>
          {WIDGETS.map((w) => (
            <Pressable key={w.id} style={[s.widget, { borderLeftColor: w.color }]} onPress={() => router.push(w.route as never)}>
              <Text style={s.widgetTitle}>{w.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={s.section}>
          {items.length} listings{!API_URL ? " · demo" : ""}
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
        ) : (
          <View style={{ paddingHorizontal: space.lg, gap: 12 }}>
            {items.length === 0 ? <Text style={s.empty}>No listings match your filters</Text> : null}
            {items.map((item, idx) => {
              const loc = [item.society?.name, item.city?.name].filter(Boolean).join(" · ");
              return (
                <Pressable
                  key={item.id}
                  style={s.card}
                  onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}
                >
                  <Image source={{ uri: THUMBS[idx % THUMBS.length] }} style={s.thumb} />
                  <View style={s.cardBody}>
                    <Text style={s.price}>{formatPrice(item.priceAmount)}</Text>
                    <Text style={s.title} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {loc ? <Text style={s.loc}>{loc}</Text> : null}
                    <Text style={s.features}>
                      {item.areaValue} {item.areaUnit}
                      {item.bedrooms != null ? ` · ${item.bedrooms} bed` : ""}
                      {item.bathrooms != null ? ` · ${item.bathrooms} bath` : ""}
                    </Text>
                    <View style={s.ctaRow}>
                      <Pressable
                        style={s.cta}
                        onPress={() => Linking.openURL("tel:+923001234567")}
                      >
                        <Text style={s.ctaText}>Call</Text>
                      </Pressable>
                      <Pressable
                        style={[s.cta, s.ctaWa]}
                        onPress={() => Linking.openURL("https://wa.me/923001234567")}
                      >
                        <Text style={[s.ctaText, { color: colors.success }]}>WhatsApp</Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  logo: { fontSize: 20, fontWeight: "800", color: colors.primary },
  tagline: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  profile: { color: colors.primary, fontWeight: "600", fontSize: 14 },
  searchBox: { paddingHorizontal: space.lg, paddingTop: space.md, backgroundColor: colors.surface },
  search: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  pills: { gap: 8, paddingHorizontal: space.lg, paddingVertical: 10, backgroundColor: colors.surface },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  section: {
    paddingHorizontal: space.lg,
    marginTop: space.md,
    marginBottom: space.sm,
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  widgets: { paddingHorizontal: space.lg, gap: 10, paddingBottom: 4 },
  widget: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    minWidth: 130,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  widgetTitle: { fontWeight: "700", fontSize: 13, color: colors.text },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 110, height: "100%", minHeight: 140, backgroundColor: "#d0d5d2" },
  cardBody: { flex: 1, padding: 12 },
  price: { fontSize: 17, fontWeight: "800", color: colors.primary },
  title: { fontSize: 14, color: colors.textSecondary, marginTop: 4, lineHeight: 20 },
  loc: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  features: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  ctaRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  cta: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  ctaWa: { borderColor: colors.success },
  ctaText: { fontSize: 12, fontWeight: "700", color: colors.primary },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 24 },
});
