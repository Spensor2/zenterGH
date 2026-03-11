import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RIDES = [
  { id: "1", name: "Bolt", price: "GH₵44", time: "9 min" },
  { id: "2", name: "Send by Car", price: "GH₵40", time: "9 min" },
  { id: "3", name: "Basic", price: "GH₵42", time: "Busy" },
  { id: "4", name: "Comfort", price: "GH₵50", time: "10 min" },
];

export default function RideOptionsScreen({ navigation }) {
  const [selected, setSelected] = useState("1");

  return (
    <View style={styles.container}>
      <FlatList
        data={RIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.ride,
              selected === item.id && styles.selectedRide,
            ]}
            onPress={() => setSelected(item.id)}
          >
            <Ionicons name="car-outline" size={24} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>

            <Text style={styles.price}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.confirm}
        onPress={() => navigation.navigate("FindingDriver")}
      >
        <Text style={styles.confirmText}>Select Bolt</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  ride: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  selectedRide: { backgroundColor: "#f0fff4" },

  info: { flex: 1, marginLeft: 10 },

  name: { fontWeight: "700" },

  time: { color: "#777" },

  price: { fontWeight: "700" },

  confirm: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  confirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});