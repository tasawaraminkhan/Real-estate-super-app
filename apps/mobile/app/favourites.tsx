import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { propertiesApi, DEMO_LISTINGS } from "../lib/api";

function formatPrice(paisa: string) {
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  if (pkr >= 100_000) return `PKR ${(pkr / 100_000).toFixed(1)} Lac`;
  return `PKR ${Math.round(pkr).toLocaleString()}`;
}

export default function FavouritesScreen() {
  const [items, setItems] = useState<typeof DEMO_LISTINGS>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      propertiesApi
        .list()
        .then((r) => {
          // demo: show first 2 as "saved" when offline
          setItems((r.items as typeof DEMO_LISTINGS).slice(0, 2));
        })
        .finally(() => setLoading(false));
    }, []),
  );

  return (
    <SafeAreaView style={s.safe}>
      <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
        <Text style={s.back}>← Back</Text>
      </Pressable>
      <Text style={s.h1}>Favourites</Text>
      {loading ? (
        <ActivityIndicator color="#0D6B5F" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListEmptyComponent={<Text style={s.empty}>Abhi koi save nahi</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={s.card}
              onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}
            >
              <Text style={s.price}>{formatPrice(item.priceAmount)}</Text>
              <Text style={s.title}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  back: { color: "#0D6B5F", fontWeight: "600" },
  h1: { fontSize: 24, fontWeight: "800", color: "#0F1C19", paddingHorizontal: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  price: { fontWeight: "800", fontSize: 16, color: "#0F1C19" },
  title: { color: "#1D2E29", marginTop: 4 },
  empty: { textAlign: "center", color: "#4A5A55", marginTop: 40 },
});
