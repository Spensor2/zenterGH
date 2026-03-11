import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { useRide } from "../context/RideContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* simulate driver movement along route */
const DRIVER_ROUTE = [
  { latitude: 4.9085, longitude: -1.7790 },
  { latitude: 4.9075, longitude: -1.7775 },
  { latitude: 4.9065, longitude: -1.7760 },
  { latitude: 4.9055, longitude: -1.7745 },
  { latitude: 4.9045, longitude: -1.7730 },
  { latitude: 4.9035, longitude: -1.7718 },
  { latitude: 4.9025, longitude: -1.7710 },
  { latitude: 4.9016, longitude: -1.7700 },
];

export default function ActiveRideScreen({ navigation }) {
  const { rideState, cancelRide } = useRide();
  const mapRef = useRef(null);

  /* animations */
  const sheetSlide = useRef(new Animated.Value(500)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const photoPulse = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const etaPulse = useRef(new Animated.Value(1)).current;
  const carBounce = useRef(new Animated.Value(0)).current;

  const [driverPos, setDriverPos] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(4);
  const [etaSeconds, setEtaSeconds] = useState(0);
  const [rideStatus, setRideStatus] = useState("approaching"); // approaching | arrived | inProgress

  /* driver & ride data */
  const driver = rideState?.driver || {
    name: "Kwame Mensah",
    rating: 4.9,
    trips: 1247,
    car: "Toyota Corolla",
    plate: "GT-2334-22",
    color: "Silver",
    phone: "+233241234567",
  };

  const pickupCoord = {
    latitude: rideState?.pickup?.lat || 4.9016,
    longitude: rideState?.pickup?.lng || -1.7831,
  };

  const destCoord = {
    latitude: rideState?.dropoff?.lat || 4.92,
    longitude: rideState?.dropoff?.lng || -1.76,
  };

  /* entrance animations */
  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheetSlide, {
        toValue: 0,
        tension: 45,
        friction: 9,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    /* photo pulse */
    Animated.loop(
      Animated.sequence([
        Animated.timing(photoPulse, {
          toValue: 1.06,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(photoPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* ETA badge pulse */
    Animated.loop(
      Animated.sequence([
        Animated.timing(etaPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(etaPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* car bounce */
    Animated.loop(
      Animated.sequence([
        Animated.timing(carBounce, {
          toValue: -5,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(carBounce, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* progress bar */
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 240000, // 4 min
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  /* simulate driver movement */
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos((prev) => {
        if (prev < DRIVER_ROUTE.length - 1) return prev + 1;
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ETA countdown */
  useEffect(() => {
    const interval = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev === 0) {
          if (etaMinutes === 0) {
            setRideStatus("arrived");
            clearInterval(interval);
            return 0;
          }
          setEtaMinutes((m) => m - 1);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [etaMinutes]);

  /* status change after driver "arrives" */
  useEffect(() => {
    if (driverPos >= DRIVER_ROUTE.length - 1 && rideStatus === "approaching") {
      setRideStatus("arrived");
    }
  }, [driverPos]);

  /* fit map */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          [pickupCoord, DRIVER_ROUTE[driverPos], destCoord],
          {
            edgePadding: { top: 140, right: 50, bottom: SCREEN_H * 0.5, left: 50 },
            animated: true,
          }
        );
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  /* curved route */
  const buildRoute = (from, to) => {
    const pts = [];
    const steps = 25;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = from.latitude + (to.latitude - from.latitude) * t;
      const lng = from.longitude + (to.longitude - from.longitude) * t;
      const curve = Math.sin(t * Math.PI) * 0.002;
      pts.push({ latitude: lat + curve, longitude: lng });
    }
    return pts;
  };

  const handleCall = () => {
    if (driver.phone) Linking.openURL(`tel:${driver.phone}`);
  };

  const handleCancel = () => {
    cancelRide?.();
    navigation?.goBack?.();
  };

  const formatEta = () =>
    `${etaMinutes}:${etaSeconds.toString().padStart(2, "0")}`;

  const statusConfig = {
    approaching: {
      color: "#2e7d32",
      bg: "#e8f5e9",
      label: "Driver is on the way",
      icon: "car-sport",
    },
    arrived: {
      color: "#1565c0",
      bg: "#e3f2fd",
      label: "Driver has arrived!",
      icon: "checkmark-circle",
    },
    inProgress: {
      color: "#e65100",
      bg: "#fff3e0",
      label: "Ride in progress",
      icon: "navigate",
    },
  };

  const status = statusConfig[rideStatus];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ═══════ MAP ═══════ */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: pickupCoord.latitude + 0.005,
          longitude: pickupCoord.longitude + 0.005,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        customMapStyle={lightMap}
      >
        {/* Pickup */}
        <Marker coordinate={pickupCoord}>
          <View style={styles.pinWrap}>
            <LinearGradient colors={["#2e7d32", "#43a047"]} style={styles.pinCircle}>
              <Ionicons name="location" size={15} color="#fff" />
            </LinearGradient>
            <View style={styles.pinTail} />
          </View>
        </Marker>

        {/* Destination */}
        <Marker coordinate={destCoord}>
          <View style={styles.pinWrap}>
            <LinearGradient colors={["#c62828", "#e53935"]} style={styles.pinCircle}>
              <Ionicons name="flag" size={13} color="#fff" />
            </LinearGradient>
            <View style={[styles.pinTail, { borderTopColor: "#c62828" }]} />
          </View>
        </Marker>

        {/* Driver Marker */}
        <Marker
          coordinate={DRIVER_ROUTE[driverPos]}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Animated.View style={[styles.driverMarker, { transform: [{ translateY: carBounce }] }]}>
            <View style={styles.driverMarkerInner}>
              <Ionicons name="car-sport" size={20} color="#2e7d32" />
            </View>
          </Animated.View>
        </Marker>

        {/* Driver → Pickup (dashed) */}
        <Polyline
          coordinates={buildRoute(DRIVER_ROUTE[driverPos], pickupCoord)}
          strokeWidth={4}
          strokeColor="#2e7d32"
          lineDashPattern={[8, 6]}
        />

        {/* Pickup → Destination */}
        <Polyline
          coordinates={buildRoute(pickupCoord, destCoord)}
          strokeWidth={5}
          strokeColor="#2e7d32"
        />
        <Polyline
          coordinates={buildRoute(pickupCoord, destCoord)}
          strokeWidth={9}
          strokeColor="rgba(46,125,50,0.10)"
        />
      </MapView>

      {/* ═══════ TOP BAR ═══════ */}
      <Animated.View style={[styles.topBar, { opacity: headerFade }]}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
        </TouchableOpacity>

        {/* status pill */}
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusLabel, { color: status.color }]}>
            {status.label}
          </Text>
        </View>

        <TouchableOpacity style={styles.circleBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </Animated.View>

      {/* ═══════ ETA BADGE ═══════ */}
      {rideStatus === "approaching" && (
        <Animated.View style={[styles.etaBadge, { transform: [{ scale: etaPulse }] }]}>
          <LinearGradient
            colors={["#2e7d32", "#1b5e20"]}
            style={styles.etaGrad}
          >
            <Ionicons name="time-outline" size={18} color="#fff" />
            <View style={styles.etaTextWrap}>
              <Text style={styles.etaTime}>{formatEta()}</Text>
              <Text style={styles.etaSub}>until arrival</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* ═══════ BOTTOM SHEET ═══════ */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetSlide }] }]}>
        <View style={styles.handle} />

        {/* progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={["#2e7d32", "#43a047", "#66bb6a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* ── Driver Card ── */}
          <View style={styles.driverCard}>
            <View style={styles.driverTop}>
              {/* photo */}
              <Animated.View
                style={[styles.photoWrap, { transform: [{ scale: photoPulse }] }]}
              >
                <View style={styles.photoGlow} />
                <View style={styles.photoCircle}>
                  <Text style={styles.photoInitials}>
                    {driver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
                <View style={styles.onlineDot} />
              </Animated.View>

              {/* info */}
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.ratingChip}>
                    <Ionicons name="star" size={12} color="#f5a623" />
                    <Text style={styles.ratingText}>{driver.rating}</Text>
                  </View>
                  <View style={styles.tripsChip}>
                    <Text style={styles.tripsText}>{driver.trips} trips</Text>
                  </View>
                  <View style={styles.verifiedChip}>
                    <Ionicons name="shield-checkmark" size={12} color="#2e7d32" />
                  </View>
                </View>
              </View>

              {/* ETA mini */}
              <View style={styles.etaMini}>
                <Text style={styles.etaMiniVal}>
                  {rideStatus === "arrived" ? "Here" : `${etaMinutes}m`}
                </Text>
                <Text style={styles.etaMiniLabel}>
                  {rideStatus === "arrived" ? "now" : "ETA"}
                </Text>
              </View>
            </View>

            {/* vehicle */}
            <View style={styles.vehicleStrip}>
              <View style={styles.vehicleLeft}>
                <View style={styles.vehicleIcon}>
                  <Ionicons name="car-sport-outline" size={20} color="#2e7d32" />
                </View>
                <View>
                  <Text style={styles.vehicleName}>{driver.car}</Text>
                  <Text style={styles.vehicleColor}>{driver.color}</Text>
                </View>
              </View>
              <View style={styles.plateBox}>
                <Text style={styles.plateText}>{driver.plate}</Text>
              </View>
            </View>
          </View>

          {/* ── Contact Row ── */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
              <LinearGradient
                colors={["#2e7d32", "#388e3c"]}
                style={styles.contactGrad}
              >
                <Ionicons name="call" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.contactLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactBtn}>
              <View style={styles.contactCircle}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#2e7d32" />
              </View>
              <Text style={styles.contactLabel}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactBtn}>
              <View style={styles.contactCircle}>
                <Ionicons name="share-outline" size={20} color="#2e7d32" />
              </View>
              <Text style={styles.contactLabel}>Share Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactBtn}>
              <View style={[styles.contactCircle, { backgroundColor: "#ffebee" }]}>
                <Ionicons name="alert-circle" size={20} color="#e53935" />
              </View>
              <Text style={styles.contactLabel}>SOS</Text>
            </TouchableOpacity>
          </View>

          {/* ── Trip Route ── */}
          <View style={styles.routeCard}>
            <Text style={styles.sectionTitle}>Trip Route</Text>

            <View style={styles.routeBody}>
              <View style={styles.routeTimeline}>
                <View style={[styles.routeDot, { backgroundColor: "#2e7d32" }]} />
                <View style={styles.routeLineVert} />
                <View style={[styles.routeDot, { backgroundColor: "#c62828" }]} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.routeStop}>
                  <Text style={styles.routeTag}>PICKUP</Text>
                  <Text style={styles.routeName}>
                    {rideState?.pickup?.name ||
                      rideState?.pickup?.address ||
                      "Current Location"}
                  </Text>
                </View>
                <View style={[styles.routeStop, { marginTop: 20 }]}>
                  <Text style={styles.routeTag}>DROP-OFF</Text>
                  <Text style={styles.routeName}>
                    {rideState?.dropoff?.name || "Destination"}
                  </Text>
                </View>
              </View>
            </View>

            {/* stats */}
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Ionicons name="navigate-outline" size={16} color="#2e7d32" />
                <Text style={styles.statVal}>
                  {rideState?.distance || "3.2"} km
                </Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#2e7d32" />
                <Text style={styles.statVal}>
                  {rideState?.estimatedTime || "12 min"}
                </Text>
              </View>
              <View style={styles.statSep} />
              <View style={styles.statItem}>
                <Ionicons name="wallet-outline" size={16} color="#2e7d32" />
                <Text style={styles.statVal}>
                  GH₵{rideState?.estimatedPrice || "44"}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Live Info ── */}
          <View style={styles.liveCard}>
            <View style={styles.liveHeader}>
              <View style={styles.liveDotWrap}>
                <View style={styles.liveDotPing} />
                <View style={styles.liveDot} />
              </View>
              <Text style={styles.liveTitle}>Live Tracking Active</Text>
            </View>
            <Text style={styles.liveSub}>
              Your ride is being monitored in real-time. Share your trip details
              with family or friends for added safety.
            </Text>
            <TouchableOpacity style={styles.shareTrip}>
              <Ionicons name="share-social-outline" size={16} color="#2e7d32" />
              <Text style={styles.shareTripText}>Share Live Location</Text>
            </TouchableOpacity>
          </View>

          {/* ── Safety Features ── */}
          <View style={styles.safetyCard}>
            <Text style={styles.sectionTitle}>Safety Features</Text>
            <View style={styles.safetyGrid}>
              {[
                {
                  icon: "shield-checkmark-outline",
                  label: "Verified\nDriver",
                  color: "#2e7d32",
                  bg: "#e8f5e9",
                },
                {
                  icon: "videocam-outline",
                  label: "Ride\nRecorded",
                  color: "#1565c0",
                  bg: "#e3f2fd",
                },
                {
                  icon: "medkit-outline",
                  label: "Insurance\nCovered",
                  color: "#e65100",
                  bg: "#fff3e0",
                },
                {
                  icon: "finger-print-outline",
                  label: "ID\nVerified",
                  color: "#6a1b9a",
                  bg: "#f3e5f5",
                },
              ].map((item, idx) => (
                <View key={idx} style={styles.safetyItem}>
                  <View style={[styles.safetyCircle, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <Text style={styles.safetyLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Ride Tips ── */}
          <View style={styles.tipsCard}>
            <View style={styles.tipRow}>
              <Ionicons name="information-circle-outline" size={16} color="#bbb" />
              <Text style={styles.tipText}>
                Meet your driver at the pickup point. Look for a {driver.color}{" "}
                {driver.car} with plate number {driver.plate}.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* ── Fixed Bottom ── */}
        <View style={styles.bottomBar}>
          {rideStatus === "arrived" ? (
            <TouchableOpacity
              style={styles.startRideBtn}
              onPress={() => {
                setRideStatus("inProgress");
              }}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#2e7d32", "#1b5e20"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startRideGrad}
              >
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={styles.startRideText}>Start Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.bottomActions}>
              <View style={styles.bottomInfoWrap}>
                <Text style={styles.bottomPrice}>
                  GH₵{rideState?.estimatedPrice || "44"}
                </Text>
                <Text style={styles.bottomPayment}>
                  Cash · {rideState?.ride?.name || "Standard"}
                </Text>
              </View>

              <TouchableOpacity style={styles.cancelRideBtn} onPress={handleCancel}>
                <Text style={styles.cancelRideText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

/* light map */
const lightMap = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e7f2" }] },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d4edda" }],
  },
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },

  /* pins */
  pinWrap: { alignItems: "center" },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 4,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#2e7d32",
    marginTop: -2,
  },

  /* driver marker */
  driverMarker: { alignItems: "center" },
  driverMarkerInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#2e7d32",
    elevation: 6,
    shadowColor: "#2e7d32",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  /* top bar */
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "700",
  },

  /* ETA badge */
  etaBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 112 : 96,
    alignSelf: "center",
    borderRadius: 18,
    elevation: 6,
    shadowColor: "#2e7d32",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  etaGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
  },
  etaTextWrap: { marginLeft: 10 },
  etaTime: { color: "#fff", fontSize: 18, fontWeight: "800" },
  etaSub: { color: "#ffffffbb", fontSize: 11, fontWeight: "600" },

  /* sheet */
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "60%",
    elevation: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -6 },
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },

  /* progress */
  progressTrack: {
    height: 3,
    backgroundColor: "#eee",
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },

  /* driver card */
  driverCard: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 14,
  },
  driverTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  photoWrap: {
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  photoGlow: {
    position: "absolute",
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(46,125,50,0.1)",
  },
  photoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
  },
  photoInitials: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2e7d32",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2e7d32",
    borderWidth: 2,
    borderColor: "#fff",
  },
  driverInfo: { flex: 1 },
  driverName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: 3,
  },
  tripsChip: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tripsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2e7d32",
  },
  verifiedChip: {
    backgroundColor: "#e8f5e9",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  etaMini: {
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  etaMiniVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2e7d32",
  },
  etaMiniLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#66bb6a",
  },

  /* vehicle strip */
  vehicleStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8faf8",
    borderRadius: 14,
    padding: 12,
  },
  vehicleLeft: { flexDirection: "row", alignItems: "center" },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  vehicleName: { fontWeight: "700", fontSize: 14, color: "#1a1a1a" },
  vehicleColor: { fontSize: 12, color: "#888", marginTop: 1 },
  plateBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  plateText: {
    fontWeight: "800",
    fontSize: 13,
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },

  /* contact */
  contactRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 14,
    gap: 10,
  },
  contactBtn: { flex: 1, alignItems: "center" },
  contactGrad: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  contactCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#555",
  },

  /* route card */
  routeCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 14,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 14,
  },
  routeBody: { flexDirection: "row" },
  routeTimeline: {
    alignItems: "center",
    marginRight: 14,
    paddingTop: 2,
  },
  routeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 2,
  },
  routeLineVert: {
    width: 2,
    height: 28,
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
  },
  routeStop: {},
  routeTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#bbb",
    letterSpacing: 1,
  },
  routeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  statItem: { flexDirection: "row", alignItems: "center" },
  statVal: {
    fontWeight: "700",
    fontSize: 13,
    color: "#1a1a1a",
    marginLeft: 6,
  },
  statSep: { width: 1, height: 20, backgroundColor: "#eee" },

  /* live card */
  liveCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#f8faf8",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e8f5e9",
    marginBottom: 14,
  },
  liveHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  liveDotWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  liveDotPing: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(46,125,50,0.2)",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2e7d32",
  },
  liveTitle: { fontWeight: "700", fontSize: 14, color: "#2e7d32" },
  liveSub: { fontSize: 12, color: "#777", lineHeight: 18, marginBottom: 10 },
  shareTrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  shareTripText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#2e7d32",
  },

  /* safety */
  safetyCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 14,
  },
  safetyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  safetyItem: { alignItems: "center", width: "23%" },
  safetyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  safetyLabel: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    lineHeight: 14,
  },

  /* tips */
  tipsCard: {
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    marginBottom: 10,
  },
  tipRow: { flexDirection: "row" },
  tipText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: "#aaa",
    lineHeight: 17,
  },

  /* bottom bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomInfoWrap: {},
  bottomPrice: { fontWeight: "800", fontSize: 20, color: "#1a1a1a" },
  bottomPayment: { fontSize: 12, color: "#999", marginTop: 2 },
  cancelRideBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ffcdd2",
    backgroundColor: "#fff5f5",
  },
  cancelRideText: { fontWeight: "700", fontSize: 14, color: "#e53935" },
  startRideBtn: { borderRadius: 16, overflow: "hidden" },
  startRideGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
  },
  startRideText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
    marginLeft: 8,
  },
});