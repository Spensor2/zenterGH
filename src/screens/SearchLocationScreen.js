import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PLACES = [
  { id: "1", name: "Grace Garden Hotel", city: "Takoradi" },
  { id: "2", name: "BU New Palace", city: "Sekondi-Takoradi" },
  { id: "3", name: "Takoradi Bus Station", city: "Takoradi" },
];

export default function SearchLocationScreen({ navigation }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Your route</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.inputCard}>
        <View style={styles.row}>
          <Ionicons name="radio-button-on" color="green" size={16} />
          <TextInput
            style={styles.input}
            placeholder="Pickup location"
            value={pickup}
            onChangeText={setPickup}
          />
        </View>

        <View style={styles.row}>
          <Ionicons name="location" color="red" size={16} />
          <TextInput
            style={styles.input}
            placeholder="Where to?"
            value={dropoff}
            onChangeText={setDropoff}
          />
        </View>
      </View>

      <FlatList
        data={PLACES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.place}
            onPress={() =>
              navigation.navigate("RideOptions", { destination: item })
            }
          >
            <Ionicons name="time-outline" size={20} color="#777" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeCity}>{item.city}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  title: { fontSize: 18, fontWeight: "700" },

  inputCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },

  place: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  placeName: { fontWeight: "600" },
  placeCity: { color: "#777", fontSize: 12 },
});