import { View, Text, StyleSheet, SafeAreaView } from "react-native";

/**
 * PropVerse mobile entry — Phase 1 shell.
 * Full navigation (auth → home map/list) lands in P05/P08.
 */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.kicker}>PROPVERSE</Text>
        <Text style={styles.title}>Real estate,{"\n"}prompt by prompt.</Text>
        <Text style={styles.lede}>
          Phase 0/1 skeleton ready. Auth, listings, PostGIS search aur society map
          agle prompts mein aayenge.
        </Text>
        <View style={styles.chipRow}>
          <Text style={styles.chip}>Expo</Text>
          <Text style={styles.chip}>NestJS</Text>
          <Text style={styles.chip}>PostGIS</Text>
          <Text style={styles.chip}>Mapbox</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EEF1EC" },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  kicker: {
    fontFamily: "System",
    fontSize: 12,
    letterSpacing: 2,
    color: "#0D6B5F",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F1C19",
    lineHeight: 38,
    marginBottom: 16,
  },
  lede: {
    fontSize: 16,
    color: "#4A5A55",
    lineHeight: 24,
    marginBottom: 24,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15,28,25,0.13)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    color: "#4A5A55",
  },
});
