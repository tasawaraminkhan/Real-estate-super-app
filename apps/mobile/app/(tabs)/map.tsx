import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useFocusEffect } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { colors, space } from "../../src/theme/tokens";
import { formatPriceFromPaisa } from "../../lib/format";
import { propertiesApi, type ListingItem } from "../../lib/api";
import { subscribeListings } from "../../lib/listingsStore";

type Plot = {
  id: string;
  plotNo: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD" | "BLOCKED";
  areaMarla: number;
  priceAmount?: string;
  noc: boolean;
  commercial?: boolean;
  highRoi?: boolean;
  underConstruction?: boolean;
  latitude: number;
  longitude: number;
};

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: "#1F7A4C",
  RESERVED: "#C6890B",
  SOLD: "#9B1C1C",
  BLOCKED: "#6B7280",
};

/** Demo DHA-style plots near Lahore (relative offsets from DHA Phase 5) */
const DEMO_PLOTS: Plot[] = [
  { id: "1", plotNo: "214", status: "AVAILABLE", areaMarla: 10, priceAmount: "24500000000", noc: true, highRoi: true, latitude: 31.4697, longitude: 74.4083 },
  { id: "2", plotNo: "215", status: "RESERVED", areaMarla: 10, priceAmount: "23800000000", noc: true, latitude: 31.4702, longitude: 74.4091 },
  { id: "3", plotNo: "216", status: "SOLD", areaMarla: 10, noc: true, latitude: 31.4708, longitude: 74.4098 },
  { id: "4", plotNo: "217", status: "AVAILABLE", areaMarla: 5, priceAmount: "12000000000", noc: false, underConstruction: true, latitude: 31.4712, longitude: 74.4075 },
  { id: "5", plotNo: "218", status: "AVAILABLE", areaMarla: 7, priceAmount: "16500000000", noc: true, highRoi: true, latitude: 31.4689, longitude: 74.4102 },
  { id: "6", plotNo: "219", status: "BLOCKED", areaMarla: 10, noc: false, latitude: 31.4685, longitude: 74.4078 },
  { id: "7", plotNo: "220", status: "AVAILABLE", areaMarla: 10, priceAmount: "25000000000", noc: true, commercial: true, latitude: 31.4715, longitude: 74.411 },
  { id: "8", plotNo: "221", status: "SOLD", areaMarla: 5, noc: true, latitude: 31.472, longitude: 74.4088 },
  { id: "9", plotNo: "222", status: "AVAILABLE", areaMarla: 8, priceAmount: "19800000000", noc: true, latitude: 31.4692, longitude: 74.4115 },
  { id: "10", plotNo: "223", status: "RESERVED", areaMarla: 12, priceAmount: "31000000000", noc: true, highRoi: true, latitude: 31.4705, longitude: 74.412 },
  { id: "11", plotNo: "224", status: "AVAILABLE", areaMarla: 5, priceAmount: "11200000000", noc: true, underConstruction: true, latitude: 31.4718, longitude: 74.4069 },
  { id: "12", plotNo: "225", status: "AVAILABLE", areaMarla: 10, priceAmount: "26000000000", noc: false, latitude: 31.468, longitude: 74.4095 },
];

const LAYERS = [
  { id: "noc", label: "NOC only" },
  { id: "commercial", label: "Commercial" },
  { id: "roi", label: "High ROI" },
  { id: "uc", label: "Under construction" },
  { id: "listings", label: "Live listings" },
] as const;

const PAKISTAN_REGION: Region = {
  latitude: 30.8,
  longitude: 72.5,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const DHA_LAHORE: Region = {
  latitude: 31.4702,
  longitude: 74.409,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function MapScreen() {
  const [selected, setSelected] = useState<Plot | null>(null);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    noc: false,
    listings: true,
  });
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [region, setRegion] = useState<Region>(DHA_LAHORE);
  const [mapReady, setMapReady] = useState(false);

  const loadListings = useCallback(() => {
    propertiesApi
      .list()
      .then((r) => setListings((r.items as ListingItem[]) ?? []))
      .catch(() => setListings([]));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [loadListings]),
  );

  useEffect(() => subscribeListings(() => loadListings()), [loadListings]);

  const visiblePlots = useMemo(() => {
    return DEMO_PLOTS.filter((p) => {
      if (layers.noc && !p.noc) return false;
      if (layers.commercial && !p.commercial) return false;
      if (layers.roi && !p.highRoi) return false;
      if (layers.uc && !p.underConstruction) return false;
      return true;
    });
  }, [layers]);

  const listingMarkers = useMemo(() => {
    if (!layers.listings) return [];
    return listings.filter((l) => l.latitude != null && l.longitude != null);
  }, [listings, layers.listings]);

  function toggle(id: string) {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Screen padded={false}>
      <View style={s.container}>
        <View style={s.header}>
          <Text style={s.h1}>Society Map</Text>
          <Text style={s.sub}>Google Maps · plots & live listings</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.layerRow}
        >
          {LAYERS.map((l) => {
            const on = !!layers[l.id];
            return (
              <Pressable key={l.id} style={[s.chip, on && s.chipOn]} onPress={() => toggle(l.id)}>
                <Text style={[s.chipText, on && s.chipTextOn]} numberOfLines={1}>
                  {l.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            style={s.chip}
            onPress={() => setRegion(DHA_LAHORE)}
          >
            <Text style={s.chipText}>DHA Lahore</Text>
          </Pressable>
          <Pressable style={s.chip} onPress={() => setRegion(PAKISTAN_REGION)}>
            <Text style={s.chipText}>Pakistan</Text>
          </Pressable>
        </ScrollView>

        <View style={s.mapWrap}>
          {!mapReady ? (
            <View style={s.mapLoading}>
              <ActivityIndicator color={colors.primary} />
              <Text style={s.mapLoadingText}>Loading Google Map…</Text>
            </View>
          ) : null}
          <MapView
            style={StyleSheet.absoluteFill}
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            region={region}
            onRegionChangeComplete={setRegion}
            onMapReady={() => setMapReady(true)}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass
            toolbarEnabled={false}
          >
            {visiblePlots.map((p) => (
              <Marker
                key={`plot-${p.id}`}
                coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                pinColor={STATUS_COLOR[p.status]}
                title={`Plot ${p.plotNo}`}
                description={`${p.status} · ${p.areaMarla} Marla`}
                onPress={() => {
                  setSelected(p);
                  setSelectedListing(null);
                }}
              />
            ))}
            {listingMarkers.map((l) => (
              <Marker
                key={`list-${l.id}`}
                coordinate={{
                  latitude: Number(l.latitude),
                  longitude: Number(l.longitude),
                }}
                pinColor={colors.primary}
                title={l.title}
                description={formatPriceFromPaisa(String(l.priceAmount))}
                onPress={() => {
                  setSelectedListing(l);
                  setSelected(null);
                }}
              />
            ))}
          </MapView>
        </View>

        <View style={s.legend}>
          {Object.entries(STATUS_COLOR).map(([k, c]) => (
            <View key={k} style={s.legendItem}>
              <View style={[s.dot, { backgroundColor: c }]} />
              <Text style={s.legendText}>{k}</Text>
            </View>
          ))}
          <View style={s.legendItem}>
            <View style={[s.dot, { backgroundColor: colors.primary }]} />
            <Text style={s.legendText}>LISTING</Text>
          </View>
        </View>

        {selected ? (
          <View style={s.card}>
            <Text style={s.cardTitle}>Plot {selected.plotNo}</Text>
            <Text style={s.cardMeta}>
              {selected.status} · {selected.areaMarla} Marla
              {selected.priceAmount ? ` · ${formatPriceFromPaisa(selected.priceAmount)}` : ""}
            </Text>
            <Text style={s.cardNoc}>
              {selected.noc ? "✓ NOC approved society" : "⚠ NOC not verified"}
            </Text>
            {selected.highRoi ? <Text style={s.cardTag}>High ROI zone</Text> : null}
            {selected.commercial ? <Text style={s.cardTag}>Commercial</Text> : null}
            {selected.underConstruction ? (
              <Text style={s.cardTag}>Under construction</Text>
            ) : null}
          </View>
        ) : null}

        {selectedListing ? (
          <View style={s.card}>
            <Text style={s.cardTitle}>{selectedListing.title}</Text>
            <Text style={s.cardMeta}>
              {formatPriceFromPaisa(String(selectedListing.priceAmount))}
              {selectedListing.city?.name ? ` · ${selectedListing.city.name}` : ""}
            </Text>
            <Text style={s.cardNoc}>
              {selectedListing.areaValue} {selectedListing.areaUnit}
              {selectedListing.purpose ? ` · ${selectedListing.purpose}` : ""}
            </Text>
            <Text style={s.cardTag}>Live listing on PropVerse</Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm },
  h1: { fontSize: 22, fontWeight: "700", color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  layerRow: { paddingHorizontal: space.md, gap: 8, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.text, fontWeight: "600" },
  chipTextOn: { color: "#fff" },
  mapWrap: {
    flex: 1,
    marginHorizontal: space.md,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 320,
    backgroundColor: "#E8EEF0",
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8EEF0",
  },
  mapLoadingText: { marginTop: 8, color: colors.textMuted, fontSize: 13 },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: space.lg,
    paddingVertical: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, color: colors.textMuted, fontWeight: "600" },
  card: {
    marginHorizontal: space.md,
    marginBottom: space.md,
    padding: space.md,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  cardMeta: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  cardNoc: { fontSize: 13, color: colors.primary, marginTop: 6, fontWeight: "600" },
  cardTag: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
