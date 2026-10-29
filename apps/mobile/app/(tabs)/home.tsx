import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { propertiesApi, API_URL } from "../../lib/api";

type Item = {
  id: string;
  title: string;
  priceAmount: string;
  areaValue: number;
  areaUnit: string;
  purpose?: string;
  city?: { name: string };
  society?: { name?: string };
};

function formatPrice(paisa: string) {
  const pkr = Number(paisa) / 100;
  if (pkr >= 10_000_000) return `PKR ${(pkr / 10_000_000).toFixed(2)} Cr`;
  if (pkr >= 100_000) return `PKR ${(pkr / 100_000).toFixed(1)} Lac`;
  return `PKR ${Math.round(pkr).toLocaleString()}`;
}

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [purpose, setPurpose] = useState<"ALL" | "SALE" | "RENT">("ALL");
  const [q, setQ] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    propertiesApi
      .list()
      .then((r) => {
        let list = r.items as Item[];
        if (purpose !== "ALL") list = list.filter((i) => (i.purpose ?? "SALE") === purpose);
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
        setTotal(list.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [purpose, q]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.logo}>PropVerse</Text>
        <Text style={s.meta}>
          {total}{!API_URL ? " · demo" : ""}
        </Text>
      </View>

      <View style={s.searchBox}>
        <TextInput
          style={s.search}
          placeholder="DHA, Bahria, Lahore..."
          placeholderTextColor="#4A5A55"
          value={q}
          onChangeText={setQ}
          onSubmitEditing={load}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filters} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {(["ALL", "SALE", "RENT"] as const).map((p) => (
          <Pressable key={p} style={[s.chip, purpose === p && s.chipOn]} onPress={() => setPurpose(p)}>
            <Text style={[s.chipText, purpose === p && s.chipTextOn]}>{p === "ALL" ? "All" : p}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color="#0D6B5F" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
          ListEmptyComponent={<Text style={s.empty}>Koi listing match nahi</Text>}
          renderItem={({ item }) => (
            <Pressable style={s.card} onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}>
              <Text style={s.price}>{formatPrice(item.priceAmount)}</Text>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.meta2}>
                {item.areaValue} {item.areaUnit}
                {item.society?.name ? ` · ${item.society.name}` : ""}
                {item.city?.name ? ` · ${item.city.name}` : ""}
              </Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15,28,25,0.1)",
  },
  logo: { fontSize: 18, fontWeight: "800", color: "#0D6B5F" },
  meta: { color: "#4A5A55", fontSize: 13 },
  searchBox: { paddingHorizontal: 16, paddingTop: 10, backgroundColor: "#fff" },
  search: {
    backgroundColor: "#EEF1EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0F1C19",
  },
  filters: { backgroundColor: "#fff", paddingVertical: 10, maxHeight: 52 },
  chip: {
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.15)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: "#0D6B5F", borderColor: "#0D6B5F" },
  chipText: { fontSize: 13, color: "#4A5A55" },
  chipTextOn: { color: "#fff", fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.1)",
  },
  price: { fontSize: 18, fontWeight: "700", color: "#0F1C19" },
  title: { fontSize: 15, color: "#1D2E29", marginTop: 4 },
  meta2: { fontSize: 13, color: "#4A5A55", marginTop: 6 },
  empty: { textAlign: "center", color: "#4A5A55", marginTop: 40 },
});
