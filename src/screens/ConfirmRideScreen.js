import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { useRide } from "../context/RideContext";

const NEARBY_CARS = [
  { id: "c1", lat: 4.903, lng: -1.775, heading: 45 },
  { id: "c2", lat: 4.907, lng: -1.765, heading: 120 },
  { id: "c3", lat: 4.895, lng: -1.770, heading: 200 },
  { id: "c4", lat: 4.912, lng: -1.758, heading: 310 },
  { id: "c5", lat: 4.899, lng: -1.780, heading: 90 },
];

export default function ConfirmOrderScreen({ navigation, route }) {
  const { pickup, destination, ride, payment } = route.params;
  const { startRideSearch } = useRide();
  const mapRef = useRef(null);

  const sheetSlide = useRef(new Animated.Value(600)).current;
  const topFade = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheetSlide, {
        toValue: 0,
        tension: 45,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(topFade, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          [
            { latitude: pickup.lat, longitude: pickup.lng },
            { latitude: destination.lat, longitude: destination.lng },
          ],
          {
            edgePadding: { top: 140, right: 60, bottom: 440, left: 60 },
            animated: true,
          }
        );
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const buildRoute = () => {
    const pts = [];
    const steps = 25;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = pickup.lat + (destination.lat - pickup.lat) * t;
      const lng = pickup.lng + (destination.lng - pickup.lng) * t;
      const bulge = Math.sin(t * Math.PI) * 0.003;
      pts.push({ latitude: lat + bulge, longitude: lng });
    }
    return pts;
  };

  const basePrice = parseFloat(ride.price.replace(/[^0-9.]/g, ""));
  const serviceFee = 2.5;
  const discount = promoApplied ? 5 : 0;
  const total = (basePrice + serviceFee - discount).toFixed(2);

  const distKm = Math.sqrt(
    Math.pow((destination.lat - pickup.lat) * 111, 2) +
      Math.pow((destination.lng - pickup.lng) * 111, 2)
  ).toFixed(1);

  const handleConfirm = () => {
    startRideSearch(pickup, destination, ride);
    navigation.replace("FindingDriver");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: (pickup.lat + destination.lat) / 2,
          longitude: (pickup.lng + destination.lng) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}>
          <View style={styles.pinWrap}>
            <LinearGradient colors={["#2e7d32", "#43a047"]} style={styles.pinCircle}>
              <Ionicons name="location" size={15} color="#fff" />
            </LinearGradient>
            <View style={styles.pinTail} />
          </View>
        </Marker>

        <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }}>
          <View style={styles.pinWrap}>
            <LinearGradient colors={["#c62828", "#e53935"]} style={styles.pinCircle}>
              <Ionicons name="flag" size={13} color="#fff" />
            </LinearGradient>
            <View style={[styles.pinTail, { borderTopColor: "#c62828" }]} />
          </View>
        </Marker>

        {NEARBY_CARS.map((c) => (
          <Marker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            rotation={c.heading}
          >
            <View style={styles.carBubble}>
              <Ionicons name="car-sport" size={18} color="#1a1a1a" />
            </View>
          </Marker>
        ))}

        <Polyline
          coordinates={buildRoute()}
          strokeWidth={5}
          strokeColor="#2e7d32"
        />
        <Polyline
          coordinates={buildRoute()}
          strokeWidth={8}
          strokeColor="rgba(46,125,50,0.15)"
        />
      </MapView>

      <Animated.View style={[styles.topBar, { opacity: topFade }]}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.titlePill}>
          <Ionicons name="shield-checkmark" size={16} color="#2e7d32" />
          <Text style={styles.titleText}>Confirm Ride</Text>
        </View>

        <TouchableOpacity style={styles.circleBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.etaPill, { opacity: topFade }]}>
        <View style={styles.etaDot} />
        <Text style={styles.etaLabel}>Nearest driver</Text>
        <Text style={styles.etaValue}>{ride.time}</Text>
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetSlide }] }]}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View style={styles.card}>
            <View style={styles.rideHeader}>
              <View style={styles.rideIconBox}>
                <Ionicons name="car-sport-outline" size={26} color="#2e7d32" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rideTitle}>{ride.name}</Text>
                <View style={styles.rideMeta}>
                  <Ionicons name="person" size={12} color="#999" />
                  <Text style={styles.rideMetaTxt}>{ride.seats}</Text>
                  <View style={styles.metaSep} />
                  <Ionicons name="time" size={12} color="#999" />
                  <Text style={styles.rideMetaTxt}>{ride.time}</Text>
                  <View style={styles.metaSep} />
                  <Ionicons name="star" size={12} color="#f5a623" />
                  <Text style={styles.rideMetaTxt}>4.8</Text>
                </View>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceMain}>{ride.price}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Trip Route</Text>

            <View style={styles.routeRow}>
              <View style={styles.routeTimeline}>
                <View style={[styles.routeDot, { backgroundColor: "#2e7d32" }]} />
                <View style={styles.routeLine} />
                <View style={[styles.routeDot, { backgroundColor: "#c62828" }]} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.routeStop}>
                  <Text style={styles.routeStopLabel}>PICKUP</Text>
                  <Text style={styles.routeStopName}>{pickup.name}</Text>
                </View>
                <View style={[styles.routeStop, { marginTop: 18 }]}>
                  <Text style={styles.routeStopLabel}>DROP-OFF</Text>
                  <Text style={styles.routeStopName}>{destination.name}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="navigate-outline" size={18} color="#2e7d32" />
                <Text style={styles.statVal}>{distKm} km</Text>
                <Text style={styles.statTxt}>Distance</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color="#2e7d32" />
                <Text style={styles.statVal}>{ride.time}</Text>
                <Text style={styles.statTxt}>Est. Time</Text>
              </View>
              <View style={styles.statDiv} />
              <View style={styles.statItem}>
                <Ionicons name="speedometer-outline" size={18} color="#2e7d32" />
                <Text style={styles.statVal}>Live</Text>
                <Text style={styles.statTxt}>Tracking</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Price Summary</Text>

            <View style={styles.pRow}>
              <Text style={styles.pLabel}>Base fare</Text>
              <Text style={styles.pVal}>{ride.price}</Text>
            </View>
            <View style={styles.pRow}>
              <Text style={styles.pLabel}>Service fee</Text>
              <Text style={styles.pVal}>GH₵{serviceFee.toFixed(2)}</Text>
            </View>
            {promoApplied && (
              <View style={styles.pRow}>
                <Text style={[styles.pLabel, { color: "#2e7d32" }]}>Promo discount</Text>
                <Text style={[styles.pVal, { color: "#2e7d32" }]}>−GH₵{discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.pDivider} />
            <View style={styles.pRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>GH₵{total}</Text>
            </View>
          </View>

          {!promoApplied ? (
            <TouchableOpacity style={styles.promoCard} onPress={() => setPromoApplied(true)}>
              <View style={styles.promoLeft}>
                <Ionicons name="pricetag-outline" size={20} color="#2e7d32" />
                <Text style={styles.promoTxt}>Apply Promo Code</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>
          ) : (
            <View style={styles.promoBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#2e7d32" />
              <Text style={styles.promoBadgeTxt}>ZENTER5 applied — GH₵5 off!</Text>
              <TouchableOpacity onPress={() => setPromoApplied(false)}>
                <Ionicons name="close-circle" size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.payCard} onPress={() => navigation.goBack()}>
            <View style={[styles.payIcon, { backgroundColor: "#27ae6015" }]}>
              <Ionicons name="cash-outline" size={22} color="#27ae60" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payLabel}>Payment</Text>
              <Text style={styles.payName}>{payment || "Cash"}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Safety Features</Text>
            <View style={styles.safetyGrid}>
              {[
                { icon: "shield-checkmark-outline", label: "Verified\nDrivers" },
                { icon: "share-outline", label: "Share\nTrip" },
                { icon: "call-outline", label: "Emergency\nSOS" },
                { icon: "eye-outline", label: "Live\nTracking" },
              ].map((item, idx) => (
                <View key={idx} style={styles.safetyItem}>
                  <View style={styles.safetyCircle}>
                    <Ionicons name={item.icon} size={22} color="#2e7d32" />
                  </View>
                  <Text style={styles.safetyTxt}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.noteRow}>
            <Ionicons name="information-circle-outline" size={16} color="#bbb" />
            <Text style={styles.noteTxt}>
              Final price may vary slightly based on route, traffic and waiting time.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomTotal}>GH₵{total}</Text>
            <Text style={styles.bottomSub}>{payment || "Cash"} · {ride.time}</Text>
          </View>

          <Animated.View style={{ flex: 1, transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <LinearGradient
                colors={["#2e7d32", "#1b5e20"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGrad}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.confirmTxt}>Confirm Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },
  pinWrap: { alignItems: "center" },
  pinCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "#fff",
    elevation: 4,
  },
  pinTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: "transparent", borderRightColor: "transparent",
    borderTopColor: "#2e7d32", marginTop: -2,
  },
  carBubble: {
    backgroundColor: "#fff", borderRadius: 12, padding: 4,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 3,
  },
  topBar: {
    position: "absolute", top: Platform.OS === "ios" ? 56 : 40,
    left: 16, right: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  circleBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  titlePill: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#ffffffee", paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, elevation: 3,
  },
  titleText: { fontWeight: "700", fontSize: 15, marginLeft: 6, color: "#1a1a1a" },
  etaPill: {
    position: "absolute", top: Platform.OS === "ios" ? 110 : 94,
    alignSelf: "center",
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, elevation: 4,
  },
  etaDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#2e7d32", marginRight: 8,
  },
  etaLabel: { fontSize: 12, color: "#888", marginRight: 6 },
  etaValue: { fontSize: 14, fontWeight: "700", color: "#2e7d32" },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "68%",
    elevation: 12, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: "#ddd",
    alignSelf: "center", marginTop: 10, marginBottom: 4,
  },
  card: {
    marginHorizontal: 20, marginTop: 14,
    backgroundColor: "#fff", borderRadius: 18,
    padding: 16, borderWidth: 1, borderColor: "#f0f0f0",
  },
  sectionLabel: { fontWeight: "700", fontSize: 15, color: "#1a1a1a", marginBottom: 12 },
  rideHeader: { flexDirection: "row", alignItems: "center" },
  rideIconBox: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: "#e8f5e9",
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  rideTitle: { fontWeight: "700", fontSize: 17, color: "#1a1a1a" },
  rideMeta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  rideMetaTxt: { fontSize: 12, color: "#999", marginLeft: 3, marginRight: 4 },
  metaSep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#ddd", marginHorizontal: 2 },
  priceBox: { alignItems: "flex-end" },
  priceMain: { fontWeight: "800", fontSize: 20, color: "#1a1a1a" },
  changeLink: { color: "#2e7d32", fontWeight: "600", fontSize: 13, marginTop: 3 },
  routeRow: { flexDirection: "row" },
  routeTimeline: { alignItems: "center", marginRight: 14, paddingTop: 2 },
  routeDot: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 3, borderColor: "#fff", elevation: 2,
  },
  routeLine: { width: 2, height: 32, backgroundColor: "#e0e0e0", marginVertical: 2 },
  routeStop: {},
  routeStopLabel: { fontSize: 10, fontWeight: "700", color: "#bbb", letterSpacing: 1 },
  routeStopName: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 2 },
  statsRow: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderColor: "#f0f0f0",
  },
  statItem: { alignItems: "center" },
  statVal: { fontWeight: "700", fontSize: 15, color: "#1a1a1a", marginTop: 4 },
  statTxt: { fontSize: 11, color: "#999", marginTop: 2 },
  statDiv: { width: 1, height: 36, backgroundColor: "#eee" },
  pRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  pLabel: { fontSize: 14, color: "#777" },
  pVal: { fontSize: 14, fontWeight: "600", color: "#333" },
  pDivider: { height: 1, backgroundColor: "#eee", marginVertical: 6 },
  totalLabel: { fontSize: 16, fontWeight: "800", color: "#1a1a1a" },
  totalVal: { fontSize: 16, fontWeight: "800", color: "#1a1a1a" },
  promoCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginHorizontal: 20, marginTop: 14, padding: 14,
    backgroundColor: "#f8faf8", borderRadius: 14, borderWidth: 1, borderColor: "#e8f5e9",
  },
  promoLeft: { flexDirection: "row", alignItems: "center" },
  promoTxt: { marginLeft: 10, fontWeight: "600", color: "#2e7d32", fontSize: 14 },
  promoBadge: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 20, marginTop: 14, padding: 12,
    backgroundColor: "#e8f5e9", borderRadius: 14,
  },
  promoBadgeTxt: { flex: 1, marginLeft: 8, fontWeight: "600", fontSize: 13, color: "#2e7d32" },
  payCard: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 20, marginTop: 14, padding: 14,
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#f0f0f0",
  },
  payIcon: {
    width: 46, height: 46, borderRadius: 13,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  payLabel: { fontSize: 11, color: "#999", fontWeight: "600" },
  payName: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginTop: 2 },
  safetyGrid: { flexDirection: "row", justifyContent: "space-between" },
  safetyItem: { alignItems: "center", width: "23%" },
  safetyCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "#e8f5e9",
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  safetyTxt: { fontSize: 11, color: "#777", textAlign: "center", lineHeight: 14 },
  noteRow: {
    flexDirection: "row", marginHorizontal: 20, marginTop: 14, padding: 12,
    backgroundColor: "#fafafa", borderRadius: 12,
  },
  noteTxt: { flex: 1, marginLeft: 8, fontSize: 12, color: "#aaa", lineHeight: 17 },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20, paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1, borderColor: "#f0f0f0",
  },
  bottomInfo: { marginRight: 14 },
  bottomTotal: { fontWeight: "800", fontSize: 20, color: "#1a1a1a" },
  bottomSub: { fontSize: 12, color: "#999", marginTop: 2 },
  confirmBtn: { borderRadius: 16, overflow: "hidden" },
  confirmGrad: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, paddingHorizontal: 24,
  },
  confirmTxt: { color: "#fff", fontWeight: "800", fontSize: 16, marginLeft: 8 },
});

