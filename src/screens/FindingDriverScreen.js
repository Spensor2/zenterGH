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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Circle } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { useRide } from "../context/RideContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const NEARBY_CARS = [
  { id: "c1", lat: 4.904, lng: -1.774, heading: 60 },
  { id: "c2", lat: 4.908, lng: -1.766, heading: 135 },
  { id: "c3", lat: 4.896, lng: -1.771, heading: 210 },
  { id: "c4", lat: 4.911, lng: -1.757, heading: 320 },
  { id: "c5", lat: 4.898, lng: -1.781, heading: 80 },
  { id: "c6", lat: 4.914, lng: -1.769, heading: 170 },
];

const SEARCH_STEPS = [
  { label: "Scanning nearby drivers", icon: "search-outline" },
  { label: "Matching your ride", icon: "git-compare-outline" },
  { label: "Confirming best driver", icon: "checkmark-circle-outline" },
];

export default function FindingDriverScreen({ navigation }) {
  const { rideState, setDriverFound } = useRide();
  const mapRef = useRef(null);

  /* animations */
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const sheetSlide = useRef(new Animated.Value(400)).current;
  const carBounce = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const [activeStep, setActiveStep] = useState(0);
  const [searchTime, setSearchTime] = useState(0);

  /* timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* step progression */
  useEffect(() => {
    const t1 = setTimeout(() => setActiveStep(1), 2000);
    const t2 = setTimeout(() => setActiveStep(2), 4000);
    const t3 = setTimeout(() => {
      // Set the driver data before navigating
      const mockDriver = {
        name: "Kwame Mensah",
        rating: 4.9,
        trips: 1247,
        car: "Toyota Camry",
        plate: "GR 4521",
        color: "#2e7d32",
        phone: "+233501234567",
      };
      setDriverFound(mockDriver);
      navigation.replace("DriverFound");
    }, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigation, setDriverFound]);

  /* progress bar */
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  /* pulse rings */
  useEffect(() => {
    const createPulse = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    createPulse(pulse1, 0).start();
    createPulse(pulse2, 600).start();
    createPulse(pulse3, 1200).start();
  }, []);

  /* spin */
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  /* dots animation */
  useEffect(() => {
    Animated.loop(
      Animated.timing(dotAnim, {
        toValue: 3,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  /* sheet entrance */
  useEffect(() => {
    Animated.spring(sheetSlide, {
      toValue: 0,
      tension: 50,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, []);

  /* car bounce */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(carBounce, {
          toValue: -6,
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
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const makePulseStyle = (anim) => ({
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 2.5],
        }),
      },
    ],
  });

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const centerLat = rideState?.pickup?.lat || 4.9016;
  const centerLng = rideState?.pickup?.lng || -1.7831;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ═══════ MAP ═══════ */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        customMapStyle={lightMap}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {/* search radius */}
        <Circle
          center={{ latitude: centerLat, longitude: centerLng }}
          radius={800}
          fillColor="rgba(46,125,50,0.06)"
          strokeColor="rgba(46,125,50,0.15)"
          strokeWidth={1}
        />
        <Circle
          center={{ latitude: centerLat, longitude: centerLng }}
          radius={400}
          fillColor="rgba(46,125,50,0.08)"
          strokeColor="rgba(46,125,50,0.2)"
          strokeWidth={1}
        />

        {/* pickup marker */}
        <Marker coordinate={{ latitude: centerLat, longitude: centerLng }}>
          <View style={styles.pickupPin}>
            <LinearGradient colors={["#2e7d32", "#43a047"]} style={styles.pickupCircle}>
              <Ionicons name="location" size={16} color="#fff" />
            </LinearGradient>
          </View>
        </Marker>

        {/* nearby cars */}
        {NEARBY_CARS.map((car) => (
          <Marker
            key={car.id}
            coordinate={{ latitude: car.lat, longitude: car.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            rotation={car.heading}
          >
            <Animated.View
              style={[styles.carMarker, { transform: [{ translateY: carBounce }] }]}
            >
              <Ionicons name="car-sport" size={18} color="#1a1a1a" />
            </Animated.View>
          </Marker>
        ))}
      </MapView>

      {/* ═══════ PULSE OVERLAY ═══════ */}
      <View style={styles.pulseCenter} pointerEvents="none">
        <Animated.View style={[styles.pulseRing, makePulseStyle(pulse1)]} />
        <Animated.View style={[styles.pulseRing, makePulseStyle(pulse2)]} />
        <Animated.View style={[styles.pulseRing, makePulseStyle(pulse3)]} />
      </View>

      {/* ═══════ TOP BAR ═══════ */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>SEARCHING</Text>
        </View>
        <View style={styles.timerPill}>
          <Ionicons name="time-outline" size={14} color="#2e7d32" />
          <Text style={styles.timerText}>{formatTime(searchTime)}</Text>
        </View>
      </View>

      {/* ═══════ CENTER SPINNER ═══════ */}
      <View style={styles.spinnerArea}>
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            colors={["#2e7d32", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spinnerGradient}
          />
        </Animated.View>
        <View style={styles.spinnerInner}>
          <Ionicons name="car-sport" size={30} color="#2e7d32" />
        </View>
      </View>

      {/* ═══════ BOTTOM SHEET ═══════ */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetSlide }] }]}>
        <View style={styles.handle} />

        {/* title row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.sheetTitle}>Finding your driver</Text>
            <Text style={styles.sheetSub}>This usually takes under a minute</Text>
          </View>
          <View style={styles.dotGroup}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.animDot,
                  {
                    opacity: dotAnim.interpolate({
                      inputRange: [i, i + 0.5, i + 1],
                      outputRange: [0.3, 1, 0.3],
                      extrapolate: "clamp",
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth.interpolate({
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

        {/* steps */}
        <View style={styles.stepsWrap}>
          {SEARCH_STEPS.map((step, idx) => {
            const isDone = idx < activeStep;
            const isActive = idx === activeStep;
            return (
              <View key={idx} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepCircle,
                    isDone && styles.stepDone,
                    isActive && styles.stepActive,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <Ionicons
                      name={step.icon}
                      size={14}
                      color={isActive ? "#2e7d32" : "#ccc"}
                    />
                  )}
                </View>
                {idx < SEARCH_STEPS.length - 1 && (
                  <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                )}
                <Text
                  style={[
                    styles.stepLabel,
                    isDone && styles.stepLabelDone,
                    isActive && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ride info */}
        <View style={styles.rideInfoCard}>
          <View style={styles.rideInfoRow}>
            <View style={styles.rideInfoIcon}>
              <Ionicons name="car-sport-outline" size={22} color="#2e7d32" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rideInfoTitle}>
                {rideState?.rideType?.name || "Zenter Ride"}
              </Text>
              <Text style={styles.rideInfoSub}>
                {rideState?.rideType?.seats || 4} seats · {rideState?.estimatedTime ? `${rideState.estimatedTime} min` : "~9 min"}
              </Text>
            </View>
            <Text style={styles.rideInfoPrice}>
              {rideState?.estimatedPrice ? `GH₵${rideState.estimatedPrice}` : "GH₵44"}
            </Text>
          </View>

          <View style={styles.rideInfoDivider} />

          <View style={styles.rideRouteRow}>
            <View style={styles.routeMini}>
              <View style={[styles.routeMiniDot, { backgroundColor: "#2e7d32" }]} />
              <View style={styles.routeMiniLine} />
              <View style={[styles.routeMiniDot, { backgroundColor: "#c62828" }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routeMiniLabel} numberOfLines={1}>
                {rideState?.pickup?.name || "Pickup location"}
              </Text>
              <Text
                style={[styles.routeMiniLabel, { marginTop: 12 }]}
                numberOfLines={1}
              >
                {rideState?.dropoff?.name || "Destination"}
              </Text>
            </View>
          </View>
        </View>

        {/* safety note */}
        <View style={styles.safetyRow}>
          <View style={styles.safetyBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#2e7d32" />
            <Text style={styles.safetyText}>Verified drivers only</Text>
          </View>
          <View style={styles.safetyBadge}>
            <Ionicons name="eye-outline" size={16} color="#2e7d32" />
            <Text style={styles.safetyText}>Live tracking</Text>
          </View>
        </View>

        {/* cancel */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={20} color="#e53935" />
          <Text style={styles.cancelText}>Cancel Ride</Text>
        </TouchableOpacity>
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
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e7f2" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d4edda" }] },
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },

  /* pulse */
  pulseCenter: {
    position: "absolute",
    top: SCREEN_H * 0.28,
    alignSelf: "center",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#2e7d32",
  },

  /* pickup pin */
  pickupPin: { alignItems: "center" },
  pickupCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 4,
  },

  /* car markers */
  carMarker: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },

  /* top bar */
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2e7d32",
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2e7d32",
    letterSpacing: 1,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  timerText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  /* spinner */
  spinnerArea: {
    position: "absolute",
    top: SCREEN_H * 0.22,
    alignSelf: "center",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "#2e7d32",
    borderRightColor: "#43a047",
  },
  spinnerGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  spinnerInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
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
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  /* title */
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: "#1a1a1a" },
  sheetSub: { fontSize: 13, color: "#999", marginTop: 3 },
  dotGroup: { flexDirection: "row", alignItems: "center" },
  animDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2e7d32",
    marginHorizontal: 3,
  },

  /* progress */
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#eee",
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },

  /* steps */
  stepsWrap: { marginBottom: 18 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepDone: { backgroundColor: "#2e7d32" },
  stepActive: { backgroundColor: "#e8f5e9", borderWidth: 2, borderColor: "#2e7d32" },
  stepLine: {
    position: "absolute",
    left: 13,
    top: 28,
    width: 2,
    height: 10,
    backgroundColor: "#eee",
  },
  stepLineDone: { backgroundColor: "#2e7d32" },
  stepLabel: { fontSize: 14, color: "#bbb", fontWeight: "500" },
  stepLabelDone: { color: "#2e7d32", fontWeight: "600" },
  stepLabelActive: { color: "#1a1a1a", fontWeight: "700" },

  /* ride info */
  rideInfoCard: {
    backgroundColor: "#f8faf8",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8f5e9",
    marginBottom: 14,
  },
  rideInfoRow: { flexDirection: "row", alignItems: "center" },
  rideInfoIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rideInfoTitle: { fontWeight: "700", fontSize: 15, color: "#1a1a1a" },
  rideInfoSub: { fontSize: 12, color: "#999", marginTop: 2 },
  rideInfoPrice: { fontWeight: "800", fontSize: 18, color: "#1a1a1a" },
  rideInfoDivider: { height: 1, backgroundColor: "#e8f5e9", marginVertical: 12 },
  rideRouteRow: { flexDirection: "row", alignItems: "center" },
  routeMini: { alignItems: "center", marginRight: 12, paddingVertical: 2 },
  routeMiniDot: { width: 10, height: 10, borderRadius: 5 },
  routeMiniLine: {
    width: 2,
    height: 16,
    backgroundColor: "#ddd",
    marginVertical: 2,
  },
  routeMiniLabel: { fontSize: 13, color: "#555", fontWeight: "500" },

  /* safety */
  safetyRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  safetyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  safetyText: { marginLeft: 6, fontSize: 12, fontWeight: "600", color: "#2e7d32" },

  /* cancel */
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#ffcdd2",
    backgroundColor: "#fff5f5",
  },
  cancelText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#e53935",
  },
});