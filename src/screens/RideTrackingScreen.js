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

/* realistic route waypoints from pickup → destination */
const FULL_ROUTE = [
  { latitude: 4.9016, longitude: -1.7831 },
  { latitude: 4.9022, longitude: -1.7815 },
  { latitude: 4.9030, longitude: -1.7798 },
  { latitude: 4.9038, longitude: -1.7782 },
  { latitude: 4.9045, longitude: -1.7768 },
  { latitude: 4.9052, longitude: -1.7755 },
  { latitude: 4.9060, longitude: -1.7742 },
  { latitude: 4.9068, longitude: -1.7730 },
  { latitude: 4.9075, longitude: -1.7718 },
  { latitude: 4.9082, longitude: -1.7705 },
  { latitude: 4.9088, longitude: -1.7690 },
  { latitude: 4.9095, longitude: -1.7675 },
  { latitude: 4.9102, longitude: -1.7660 },
  { latitude: 4.9110, longitude: -1.7648 },
  { latitude: 4.9118, longitude: -1.7635 },
  { latitude: 4.9128, longitude: -1.7622 },
  { latitude: 4.9138, longitude: -1.7612 },
  { latitude: 4.9150, longitude: -1.7605 },
  { latitude: 4.9162, longitude: -1.7600 },
  { latitude: 4.9175, longitude: -1.7598 },
  { latitude: 4.9188, longitude: -1.7600 },
  { latitude: 4.9200, longitude: -1.7600 },
];

const RideTrackingScreen = ({ navigation }) => {
  const { rideState, completeRide, cancelRide } = useRide();
  const {
    driver,
    pickup,
    dropoff,
    rideType,
    estimatedPrice,
    distance,
  } = rideState || {};

  const mapRef = useRef(null);

  /* animations */
  const sheetSlide = useRef(new Animated.Value(500)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const carBounce = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const livePulse = useRef(new Animated.Value(0.4)).current;
  const fareGlow = useRef(new Animated.Value(1)).current;

  /* state */
  const [driverIndex, setDriverIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentFare, setCurrentFare] = useState(
    parseFloat(String(estimatedPrice || "44").replace(/[^0-9.]/g, "")) || 44
  );
  const [ridePhase, setRidePhase] = useState("inProgress"); // inProgress | nearDestination | arrived

  const baseFare = parseFloat(String(estimatedPrice || "44").replace(/[^0-9.]/g, "")) || 44;

  const driverData = driver || {
    name: "Kwame Mensah",
    rating: 4.9,
    trips: 1247,
    car: "Toyota Camry",
    plate: "GT-2334-22",
    color: "Silver",
    phone: "+233241234567",
  };

  const pickupCoord = {
    latitude: pickup?.lat || FULL_ROUTE[0].latitude,
    longitude: pickup?.lng || FULL_ROUTE[0].longitude,
  };

  const destCoord = {
    latitude: pickup?.lat
      ? pickup.lat + 0.018
      : FULL_ROUTE[FULL_ROUTE.length - 1].latitude,
    longitude: pickup?.lng
      ? pickup.lng + 0.023
      : FULL_ROUTE[FULL_ROUTE.length - 1].longitude,
  };

  /* ── entrance animations ── */
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

    /* car bounce */
    Animated.loop(
      Animated.sequence([
        Animated.timing(carBounce, {
          toValue: -4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(carBounce, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* live dot pulse */
    Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(livePulse, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* fare glow */
    Animated.loop(
      Animated.sequence([
        Animated.timing(fareGlow, {
          toValue: 1.04,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fareGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* progress bar across entire ride */
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 30000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  /* simulate driver movement */
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setDriverIndex((prev) => {
        const next = prev + 1;
        if (next >= FULL_ROUTE.length - 1) {
          setRidePhase("arrived");
          clearInterval(moveInterval);
          return FULL_ROUTE.length - 1;
        }
        if (next >= FULL_ROUTE.length - 4) {
          setRidePhase("nearDestination");
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(moveInterval);
  }, []);

  /* elapsed timer + fare meter */
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((p) => p + 1);
      setCurrentFare((p) => Math.min(p + 0.15, baseFare * 1.3));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* re-center map as driver moves */
  useEffect(() => {
    if (mapRef.current && driverIndex < FULL_ROUTE.length) {
      const driverPt = FULL_ROUTE[driverIndex];
      mapRef.current.animateToRegion(
        {
          latitude: driverPt.latitude - 0.004,
          longitude: driverPt.longitude,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        },
        800
      );
    }
  }, [driverIndex]);

  /* ── helpers ── */
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const tripDistKm = (
    (driverIndex / (FULL_ROUTE.length - 1)) *
    (parseFloat(distance) || 3.2)
  ).toFixed(1);

  const remainingMin = Math.max(
    0,
    Math.ceil(
      ((FULL_ROUTE.length - 1 - driverIndex) / (FULL_ROUTE.length - 1)) * 12
    )
  );

  /* heading between two consecutive points */
  const getHeading = () => {
    if (driverIndex >= FULL_ROUTE.length - 1) return 0;
    const from = FULL_ROUTE[driverIndex];
    const to = FULL_ROUTE[driverIndex + 1];
    const dLng = to.longitude - from.longitude;
    const dLat = to.latitude - from.latitude;
    return (Math.atan2(dLng, dLat) * 180) / Math.PI;
  };

  /* route already travelled vs remaining */
  const travelledRoute = FULL_ROUTE.slice(0, driverIndex + 1);
  const remainingRoute = FULL_ROUTE.slice(driverIndex);

  const handleComplete = () => {
    completeRide();
    navigation.replace("RideComplete");
  };

  const handleCancel = () => {
    cancelRide();
    navigation.goBack();
  };

  const handleCall = () => {
    if (driverData.phone) Linking.openURL(`tel:${driverData.phone}`);
  };

  const phaseConfig = {
    inProgress: { color: "#2e7d32", bg: "#e8f5e9", label: "Ride in Progress" },
    nearDestination: {
      color: "#e65100",
      bg: "#fff3e0",
      label: "Approaching Destination",
    },
    arrived: { color: "#1565c0", bg: "#e3f2fd", label: "You Have Arrived!" },
  };
  const phase = phaseConfig[ridePhase];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ═══════ MAP ═══════ */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: pickupCoord.latitude,
          longitude: pickupCoord.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={lightMap}
      >
        {/* Pickup */}
        <Marker coordinate={pickupCoord}>
          <View style={styles.pinWrap}>
            <LinearGradient
              colors={["#2e7d32", "#43a047"]}
              style={styles.pinBubble}
            >
              <Ionicons name="location" size={14} color="#fff" />
            </LinearGradient>
            <View style={styles.pinTail} />
          </View>
        </Marker>

        {/* Destination */}
        <Marker coordinate={destCoord}>
          <View style={styles.pinWrap}>
            <LinearGradient
              colors={["#c62828", "#e53935"]}
              style={styles.pinBubble}
            >
              <Ionicons name="flag" size={12} color="#fff" />
            </LinearGradient>
            <View style={[styles.pinTail, { borderTopColor: "#c62828" }]} />
          </View>
        </Marker>

        {/* Driver Car Marker */}
        <Marker
          coordinate={FULL_ROUTE[driverIndex]}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          rotation={getHeading()}
        >
          <Animated.View
            style={[
              styles.carMarker,
              { transform: [{ translateY: carBounce }] },
            ]}
          >
            <View style={styles.carCircle}>
              <Ionicons name="car-sport" size={22} color="#2e7d32" />
            </View>
          </Animated.View>
        </Marker>

        {/* Travelled route (darker green) */}
        {travelledRoute.length > 1 && (
          <Polyline
            coordinates={travelledRoute}
            strokeWidth={6}
            strokeColor="#1b5e20"
          />
        )}

        {/* Remaining route */}
        <Polyline
          coordinates={remainingRoute}
          strokeWidth={5}
          strokeColor="#43a047"
          lineDashPattern={[0]}
        />
        {/* shadow line */}
        <Polyline
          coordinates={remainingRoute}
          strokeWidth={10}
          strokeColor="rgba(46,125,50,0.10)"
        />
      </MapView>

      {/* ═══════ TOP BAR ═══════ */}
      <Animated.View style={[styles.topBar, { opacity: headerFade }]}>
        <TouchableOpacity style={styles.circleBtn} onPress={handleCancel}>
          <Ionicons name="close" size={20} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={[styles.statusPill, { backgroundColor: phase.bg }]}>
          <Animated.View
            style={[
              styles.statusDot,
              { backgroundColor: phase.color, opacity: livePulse },
            ]}
          />
          <Text style={[styles.statusText, { color: phase.color }]}>
            {phase.label}
          </Text>
        </View>

        <TouchableOpacity style={styles.circleBtn}>
          <Ionicons name="help-circle-outline" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </Animated.View>

      {/* ═══════ FLOATING ETA CARD ═══════ */}
      {ridePhase !== "arrived" && (
        <View style={styles.etaFloat}>
          <LinearGradient
            colors={["#2e7d32", "#1b5e20"]}
            style={styles.etaGrad}
          >
            <View style={styles.etaRow}>
              <Ionicons name="time-outline" size={20} color="#fff" />
              <View style={styles.etaInfo}>
                <Text style={styles.etaVal}>{remainingMin} min</Text>
                <Text style={styles.etaSub}>to destination</Text>
              </View>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaRow}>
              <Ionicons name="navigate-outline" size={20} color="#fff" />
              <View style={styles.etaInfo}>
                <Text style={styles.etaVal}>{tripDistKm} km</Text>
                <Text style={styles.etaSub}>covered</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* ═══════ BOTTOM SHEET ═══════ */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: sheetSlide }] }]}
      >
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
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {/* ── Driver Card ── */}
          <View style={styles.driverCard}>
            <View style={styles.driverRow}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarGlow} />
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>
                    {driverData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driverData.name}</Text>
                <View style={styles.chipRow}>
                  <View style={styles.ratingChip}>
                    <Ionicons name="star" size={11} color="#f5a623" />
                    <Text style={styles.ratingVal}>{driverData.rating}</Text>
                  </View>
                  <Text style={styles.carLabel}>
                    {driverData.car} · {driverData.plate}
                  </Text>
                </View>
              </View>

              {/* contact icons */}
              <TouchableOpacity style={styles.actionCircle}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={18}
                  color="#2e7d32"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionCircle, { marginLeft: 8 }]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={18} color="#2e7d32" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Live Stats ── */}
          <View style={styles.statsCard}>
            <View style={styles.statBox}>
              <View style={styles.statIconWrap}>
                <Ionicons name="time-outline" size={20} color="#2e7d32" />
              </View>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statSep} />
            <View style={styles.statBox}>
              <View style={styles.statIconWrap}>
                <Ionicons name="navigate-outline" size={20} color="#2e7d32" />
              </View>
              <Text style={styles.statValue}>{tripDistKm} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statSep} />
            <Animated.View
              style={[styles.statBox, { transform: [{ scale: fareGlow }] }]}
            >
              <View style={styles.statIconWrap}>
                <Ionicons name="wallet-outline" size={20} color="#2e7d32" />
              </View>
              <Text style={styles.statValue}>
                GH₵{Math.round(currentFare)}
              </Text>
              <Text style={styles.statLabel}>Fare</Text>
            </Animated.View>
          </View>

          {/* ── Route Card ── */}
          <View style={styles.routeCard}>
            <Text style={styles.sectionTitle}>Trip Route</Text>

            <View style={styles.routeBody}>
              <View style={styles.routeTimeline}>
                <View style={[styles.routeDot, { backgroundColor: "#2e7d32" }]} />
                <View style={styles.routeLineV} />
                <View
                  style={[
                    styles.routeCarDot,
                    {
                      top: `${
                        (driverIndex / (FULL_ROUTE.length - 1)) * 100
                      }%`,
                    },
                  ]}
                >
                  <Ionicons name="car-sport" size={12} color="#2e7d32" />
                </View>
                <View style={[styles.routeDot, { backgroundColor: "#c62828" }]} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.routeStop}>
                  <Text style={styles.routeTag}>PICKUP</Text>
                  <Text style={styles.routeStopName}>
                    {pickup?.name || pickup?.address || "Current Location"}
                  </Text>
                </View>
                <View style={[styles.routeStop, { marginTop: 24 }]}>
                  <Text style={styles.routeTag}>DESTINATION</Text>
                  <Text style={styles.routeStopName}>
                    {dropoff?.name || "Destination"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Live Tracking ── */}
          <View style={styles.liveCard}>
            <View style={styles.liveHeader}>
              <View style={styles.liveDotWrap}>
                <Animated.View
                  style={[styles.livePing, { opacity: livePulse }]}
                />
                <View style={styles.liveDot} />
              </View>
              <Text style={styles.liveTitle}>Live Tracking Active</Text>
            </View>
            <Text style={styles.liveSub}>
              Your ride is being monitored in real-time for your safety.
            </Text>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons
                name="share-social-outline"
                size={16}
                color="#2e7d32"
              />
              <Text style={styles.shareBtnText}>Share Live Location</Text>
            </TouchableOpacity>
          </View>

          {/* ── Safety Features ── */}
          <View style={styles.safetyCard}>
            <Text style={styles.sectionTitle}>Safety</Text>
            <View style={styles.safetyRow}>
              {[
                {
                  icon: "shield-checkmark-outline",
                  label: "Insured",
                  bg: "#e8f5e9",
                  color: "#2e7d32",
                },
                {
                  icon: "videocam-outline",
                  label: "Recorded",
                  bg: "#e3f2fd",
                  color: "#1565c0",
                },
                {
                  icon: "alert-circle-outline",
                  label: "SOS",
                  bg: "#ffebee",
                  color: "#e53935",
                },
                {
                  icon: "people-outline",
                  label: "Share",
                  bg: "#f3e5f5",
                  color: "#7b1fa2",
                },
              ].map((s, i) => (
                <TouchableOpacity key={i} style={styles.safetyItem}>
                  <View style={[styles.safetyCircle, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon} size={20} color={s.color} />
                  </View>
                  <Text style={styles.safetyLabel}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Ride Note ── */}
          <View style={styles.noteRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#bbb"
            />
            <Text style={styles.noteText}>
              Fare is calculated based on distance and time. Final amount may
              differ slightly from the estimate.
            </Text>
          </View>
        </ScrollView>

        {/* ── Fixed Bottom ── */}
        <View style={styles.bottomBar}>
          {ridePhase === "arrived" ? (
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={handleComplete}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#2e7d32", "#1b5e20"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.completeGrad}
              >
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.completeTxt}>Complete Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.bottomRow}>
              <View style={styles.fareWrap}>
                <Text style={styles.fareAmount}>
                  GH₵{Math.round(currentFare)}
                </Text>
                <Text style={styles.fareSub}>
                  {rideType?.name || "Standard"} · Cash
                </Text>
              </View>

              <View style={styles.bottomBtns}>
                <TouchableOpacity
                  style={styles.recenterBtn}
                  onPress={() => {
                    if (mapRef.current) {
                      mapRef.current.animateToRegion(
                        {
                          latitude: FULL_ROUTE[driverIndex].latitude - 0.004,
                          longitude: FULL_ROUTE[driverIndex].longitude,
                          latitudeDelta: 0.018,
                          longitudeDelta: 0.018,
                        },
                        600
                      );
                    }
                  }}
                >
                  <Ionicons name="locate" size={20} color="#2e7d32" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelSmall}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelSmallText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

/* light map */
const lightMap = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e0e0e0" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9e7f2" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d4edda" }],
  },
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },

  /* map markers */
  pinWrap: { alignItems: "center" },
  pinBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 4,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#2e7d32",
    marginTop: -2,
  },
  carMarker: { alignItems: "center" },
  carCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#2e7d32",
    elevation: 8,
    shadowColor: "#2e7d32",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 13, fontWeight: "700" },

  /* ETA float */
  etaFloat: {
    position: "absolute",
    top: Platform.OS === "ios" ? 114 : 98,
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
    paddingVertical: 12,
    borderRadius: 18,
  },
  etaRow: { flexDirection: "row", alignItems: "center" },
  etaInfo: { marginLeft: 8 },
  etaVal: { color: "#fff", fontWeight: "800", fontSize: 16 },
  etaSub: { color: "#ffffffaa", fontSize: 11 },
  etaDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#ffffff40",
    marginHorizontal: 14,
  },

  /* sheet */
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "55%",
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
    marginBottom: 12,
  },
  progressFill: { height: "100%", borderRadius: 2, overflow: "hidden" },

  /* driver card */
  driverCard: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 12,
  },
  driverRow: { flexDirection: "row", alignItems: "center" },
  avatarWrap: { marginRight: 12 },
  avatarGlow: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(46,125,50,0.08)",
    top: -2,
    left: -2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
  },
  avatarInitials: { fontSize: 18, fontWeight: "800", color: "#2e7d32" },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2e7d32",
    borderWidth: 2,
    borderColor: "#fff",
  },
  driverInfo: { flex: 1 },
  driverName: { fontWeight: "800", fontSize: 16, color: "#1a1a1a" },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: 3,
  },
  carLabel: { fontSize: 11, color: "#888" },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
  },

  /* stats */
  statsCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#f8faf8",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e8f5e9",
    marginBottom: 12,
  },
  statBox: { flex: 1, alignItems: "center" },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: { fontWeight: "800", fontSize: 16, color: "#1a1a1a" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },
  statSep: { width: 1, height: 50, backgroundColor: "#e0e0e0" },

  /* route card */
  routeCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 12,
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
    position: "relative",
  },
  routeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 2,
  },
  routeLineV: {
    width: 2,
    height: 32,
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
  },
  routeCarDot: {
    position: "absolute",
    left: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2e7d32",
  },
  routeStop: {},
  routeTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#bbb",
    letterSpacing: 1,
  },
  routeStopName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },

  /* live card */
  liveCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#f8faf8",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e8f5e9",
    marginBottom: 12,
  },
  liveHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  liveDotWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  livePing: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(46,125,50,0.25)",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2e7d32",
  },
  liveTitle: { fontWeight: "700", fontSize: 14, color: "#2e7d32" },
  liveSub: { fontSize: 12, color: "#777", lineHeight: 18, marginBottom: 10 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  shareBtnText: {
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
    marginBottom: 12,
  },
  safetyRow: { flexDirection: "row", justifyContent: "space-between" },
  safetyItem: { alignItems: "center", width: "23%" },
  safetyCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  safetyLabel: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    fontWeight: "600",
  },

  /* note */
  noteRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    marginBottom: 10,
  },
  noteText: {
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
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fareWrap: {},
  fareAmount: { fontWeight: "800", fontSize: 22, color: "#1a1a1a" },
  fareSub: { fontSize: 12, color: "#999", marginTop: 2 },
  bottomBtns: { flexDirection: "row", alignItems: "center", gap: 10 },
  recenterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelSmall: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ffcdd2",
    backgroundColor: "#fff5f5",
  },
  cancelSmallText: { fontWeight: "700", fontSize: 14, color: "#e53935" },
  completeBtn: { borderRadius: 16, overflow: "hidden" },
  completeGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
  },
  completeTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
    marginLeft: 8,
  },
});

export default RideTrackingScreen;