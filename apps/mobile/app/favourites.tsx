import { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Screen } from "../src/components/Screen";
import { colors, space } from "../src/theme/tokens";
import { propertiesApi, DEMO_LISTINGS } from "../lib/api";
import { formatPriceFromPaisa } from "../lib/format";

export default function FavouritesScreen() {
  const [items, setItems] = useState<typeof DEMO_LISTINGS>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      propertiesApi
        .list()
        .then((r) => setItems((r.items as typeof DEMO_LISTINGS).slice(0, 2)))
        .finally(() => setLoading(false));
    }, []),
  );

  return (
    <Screen padded={false}>
      <Pressable onPress={() => router.back()} style={{ padding: space.lg }}>
        <Text style={s.back}>← Back</Text>
      </Pressable>
      <Text style={s.h1}>Favourites</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: space.lg, gap: 10 }}
          ListEmptyComponent={<Text style={s.empty}>No saved listings yet</Text>}
          renderItem={({ item }) => (
            <Pressable style={s.card} onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}>
              <Text style={s.price}>{formatPriceFromPaisa(item.priceAmount)}</Text>
              <Text style={s.title}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { color: colors.primary, fontWeight: "600" },
  h1: { fontSize: 24, fontWeight: "800", color: colors.text, paddingHorizontal: space.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  price: { fontWeight: "800", fontSize: 16, color: colors.primary },
  title: { color: colors.textSecondary, marginTop: 4 },
  empty: { textAlign: "center", color: colors.textMuted, marginTop: 40 },
});
