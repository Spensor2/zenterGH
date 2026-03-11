import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { useRide } from "../context/RideContext";

/* ── sample locations the user can pick ── */
const LOCATIONS = [
  { id: "1", name: "Takoradi Market Circle", lat: 4.8985, lng: -1.7603 },
  { id: "2", name: "Grace Garden Hotel", lat: 4.92, lng: -1.76 },
  { id: "3", name: "Takoradi Mall", lat: 4.9016, lng: -1.7831 },
  { id: "4", name: "Airport Ridge", lat: 4.9125, lng: -1.7745 },
  { id: "5", name: "Anaji Roundabout", lat: 4.9078, lng: -1.7512 },
  { id: "6", name: "Beach Road", lat: 4.893, lng: -1.765 },
  { id: "7", name: "European Town", lat: 4.896, lng: -1.755 },
  { id: "8", name: "New Takoradi", lat: 4.885, lng: -1.745 },
  { id: "9", name: "Effia-Nkwanta Hospital", lat: 4.91, lng: -1.77 },
  { id: "10", name: "UMAT Campus", lat: 4.878, lng: -1.758 },
];

const RIDES = [
  { id: "bolt", name: "Bolt", price: "GH₵44", time: "9 min", seats: 4 },
  { id: "send", name: "Send by Car", price: "GH₵40", time: "9 min", seats: 4 },
  { id: "basic", name: "Basic", price: "GH₵42", time: "Busy", seats: 4 },
  { id: "comfort", name: "Comfort", price: "GH₵50", time: "10 min", seats: 4 },
];

export default function RideBookingScreen({ navigation }) {
  const { startRideSearch } = useRide();
  const mapRef = useRef(null);

  const [selectedRide, setSelectedRide] = useState("bolt");
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cash");

  /* modal state */
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTarget, setModalTarget] = useState("pickup"); // "pickup" | "destination" | "payment"
  const [searchQuery, setSearchQuery] = useState("");

  /* payment methods */
  const PAYMENT_METHODS = [
    { id: "cash", name: "Cash", icon: "cash-outline", color: "#27ae60" },
    { id: "wallet", name: "Zenter Wallet", icon: "wallet-outline", color: "#6c63ff" },
    { id: "visa", name: "Visa •••• 4242", icon: "card-outline", color: "#1a1a1a" },
    { id: "mastercard", name: "Mastercard •••• 8888", icon: "card-outline", color: "#eb001b" },
  ];

  /* ── helpers ── */
  const openPicker = (target) => {
    setModalTarget(target);
    setSearchQuery("");
    setModalVisible(true);
  };

  const selectLocation = (loc) => {
    if (modalTarget === "pickup") setPickup(loc);
    else setDestination(loc);

    Keyboard.dismiss();
    setModalVisible(false);

    /* auto‑fit map when both points exist */
    const newPickup = modalTarget === "pickup" ? loc : pickup;
    const newDest = modalTarget === "destination" ? loc : destination;

    if (newPickup && newDest && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: newPickup.lat, longitude: newPickup.lng },
          { latitude: newDest.lat, longitude: newDest.lng },
        ],
        { edgePadding: { top: 120, right: 60, bottom: 350, left: 60 }, animated: true }
      );
    }
  };

  const filteredLocations = LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (!pickup || !destination) return;
    const ride = RIDES.find((r) => r.id === selectedRide);
    const paymentMethod = PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name || 'Cash';
    // Navigate to ConfirmRide screen with ride details
    navigation.navigate("ConfirmRide", {
      pickup,
      destination,
      ride,
      payment: paymentMethod,
    });
  };

  const bothSelected = pickup && destination;

  /* ── ride list item ── */
  const renderRide = ({ item }) => {
    const active = item.id === selectedRide;
    return (
      <TouchableOpacity
        style={[styles.rideCard, active && styles.rideSelected]}
        onPress={() => setSelectedRide(item.id)}
      >
        <View style={styles.rideLeft}>
          <Ionicons name="car-outline" size={26} color="#1a1a1a" />
        </View>
        <View style={styles.rideMiddle}>
          <Text style={styles.rideName}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.time}>{item.time}</Text>
            <Ionicons name="person-outline" size={14} color="#888" />
            <Text style={styles.seats}>{item.seats}</Text>
          </View>
        </View>
        <Text style={styles.price}>{item.price}</Text>
      </TouchableOpacity>
    );
  };

  /* ── location search modal item ── */
  const renderLocationItem = ({ item }) => (
    <TouchableOpacity style={styles.locItem} onPress={() => selectLocation(item)}>
      <View style={styles.locIconWrap}>
        <Ionicons name="location-outline" size={20} color="#2e7d32" />
      </View>
      <Text style={styles.locName}>{item.name}</Text>
    </TouchableOpacity>
  );

  /* ────────────────── UI ────────────────── */
  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 4.9016,
          longitude: -1.7831,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        {pickup && (
          <Marker
            coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}
            title="Pickup"
            pinColor="green"
          />
        )}
        {destination && (
          <Marker
            coordinate={{ latitude: destination.lat, longitude: destination.lng }}
            title="Destination"
            pinColor="red"
          />
        )}
        {bothSelected && (
          <Polyline
            coordinates={[
              { latitude: pickup.lat, longitude: pickup.lng },
              { latitude: destination.lat, longitude: destination.lng },
            ]}
            strokeWidth={4}
            strokeColor="#2e7d32"
          />
        )}
      </MapView>

      {/* TOP ROUTE BAR */}
      <View style={styles.routeBar}>
        {/* close button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color="#333" />
        </TouchableOpacity>

        {/* inputs column */}
        <View style={styles.inputsColumn}>
          {/* timeline dots + line */}
          <View style={styles.timeline}>
            <View style={[styles.dot, { backgroundColor: "#2e7d32" }]} />
            <View style={styles.dashLine} />
            <View style={[styles.dot, { backgroundColor: "#d32f2f" }]} />
          </View>

          {/* text fields */}
          <View style={styles.inputsWrap}>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => openPicker("pickup")}
            >
              <Text style={pickup ? styles.inputFilled : styles.inputPlaceholder}>
                {pickup ? pickup.name : "Choose pickup location"}
              </Text>
            </TouchableOpacity>

            <View style={styles.inputDivider} />

            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => openPicker("destination")}
            >
              <Text
                style={destination ? styles.inputFilled : styles.inputPlaceholder}
              >
                {destination ? destination.name : "Choose destination"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* swap button */}
        <TouchableOpacity
          style={styles.swapBtn}
          onPress={() => {
            setPickup(destination);
            setDestination(pickup);
          }}
        >
          <Ionicons name="swap-vertical" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET */}
      <View style={styles.sheet}>
        <FlatList
          data={RIDES}
          keyExtractor={(item) => item.id}
          renderItem={renderRide}
        />

        {/* PAYMENT */}
        <TouchableOpacity 
          style={styles.paymentRow}
          onPress={() => openPicker("payment")}
        >
          <Ionicons name={selectedPayment === 'cash' ? 'cash-outline' : selectedPayment === 'wallet' ? 'wallet-outline' : 'card-outline'} size={20} color="#27ae60" />
          <Text style={styles.paymentText}>
            {PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name || 'Cash'}
          </Text>
          <Ionicons name="chevron-down" size={18} />
        </TouchableOpacity>

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          style={[styles.confirmBtn, !bothSelected && { opacity: 0.45 }]}
          onPress={handleConfirm}
          disabled={!bothSelected}
        >
          <LinearGradient
            colors={["#2e7d32", "#1b5e20"]}
            style={styles.confirmGradient}
          >
            <Text style={styles.confirmText}>
              {bothSelected ? "Select Zenter" : "Pick locations first"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── LOCATION PICKER MODAL ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalTarget === "pickup"
                  ? "Select Pickup Location"
                  : modalTarget === "destination"
                  ? "Select Destination"
                  : "Select Payment Method"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {modalTarget === "payment" ? (
              /* PAYMENT METHODS LIST */
              <FlatList
                data={PAYMENT_METHODS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      selectedPayment === item.id && styles.paymentOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedPayment(item.id);
                      setModalVisible(false);
                    }}
                  >
                    <View style={[styles.paymentIconWrap, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={22} color={item.color} />
                    </View>
                    <Text style={styles.paymentName}>{item.name}</Text>
                    {selectedPayment === item.id && (
                      <Ionicons name="checkmark-circle" size={22} color="#27ae60" />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <>
                {/* search bar */}
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={18} color="#999" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search location…"
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={18} color="#bbb" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* results */}
                <FlatList
                  data={filteredLocations}
                  keyExtractor={(item) => item.id}
                  renderItem={renderLocationItem}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>No locations found</Text>
                  }
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ════════════════════  STYLES  ════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1 },

  /* ── route bar ── */
  routeBar: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  closeBtn: { marginRight: 10 },

  inputsColumn: { flex: 1, flexDirection: "row", alignItems: "center" },

  timeline: { alignItems: "center", marginRight: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dashLine: {
    width: 2,
    height: 28,
    backgroundColor: "#ccc",
    marginVertical: 2,
  },

  inputsWrap: { flex: 1 },
  inputRow: { paddingVertical: 8 },
  inputDivider: { height: 1, backgroundColor: "#eee" },
  inputPlaceholder: { color: "#aaa", fontSize: 14 },
  inputFilled: { color: "#1a1a1a", fontSize: 14, fontWeight: "600" },

  swapBtn: {
    marginLeft: 10,
    padding: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
  },

  /* ── bottom sheet ── */
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rideSelected: { borderColor: "#2e7d32" },
  rideLeft: { marginRight: 14 },
  rideMiddle: { flex: 1 },
  rideName: { fontWeight: "700", fontSize: 15 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  time: { color: "#888", marginRight: 8 },
  seats: { marginLeft: 4, color: "#888" },
  price: { fontWeight: "700", fontSize: 16 },

  paymentRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  paymentText: { marginHorizontal: 6, fontWeight: "600" },

  confirmBtn: { marginTop: 14, borderRadius: 16, overflow: "hidden" },
  confirmGradient: { paddingVertical: 16, alignItems: "center" },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  /* ── modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 17, fontWeight: "700" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },

  locItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  locIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locName: { fontSize: 15, fontWeight: "500", color: "#222" },

  /* payment options */
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  paymentOptionSelected: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#27ae60",
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  paymentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 30,
    fontSize: 14,
  },
});