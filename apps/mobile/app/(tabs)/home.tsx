import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
} from "react-native";
import { propertiesApi, API_URL } from "../../lib/api";

type Item = {
  id: string;
  title: string;
  priceAmount: string;
  areaValue: number;
  areaUnit: string;
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

  useEffect(() => {
    propertiesApi
      .list()
      .then((r) => {
        setItems(r.items as Item[]);
        setTotal(r.pageInfo.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.logo}>PropVerse</Text>
        <Text style={s.meta}>
          {total} listings{!API_URL ? " · demo" : ""}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color="#0D6B5F" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          ListEmptyComponent={
            <Text style={s.empty}>Koi listing nahi</Text>
          }
          renderItem={({ item }) => (
            <Pressable style={s.card}>
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(15,28,25,0.1)",
    backgroundColor: "#fff",
  },
  logo: { fontSize: 18, fontWeight: "800", color: "#0D6B5F" },
  meta: { color: "#4A5A55", fontSize: 13 },
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
