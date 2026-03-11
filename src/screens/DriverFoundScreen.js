import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRide } from '../context/RideContext';

const { width } = Dimensions.get('window');

const DriverFoundScreen = ({ navigation }) => {
const { rideState, startTracking, cancelRide } = useRide();

// Add safety check for rideState
if (!rideState) {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const { driver, pickup, dropoff, rideType, estimatedPrice, estimatedTime, distance } = rideState;

const slideAnim = useRef(new Animated.Value(100)).current;
const fadeAnim = useRef(new Animated.Value(0)).current;
const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
Animated.parallel([
Animated.spring(slideAnim, {
toValue: 0,
friction: 8,
tension: 60,
useNativeDriver: true,
}),
    Animated.timing(fadeAnim, {
toValue: 1,
duration: 500,
useNativeDriver: true,
}),
]).start();

Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, {
      toValue: 1.1,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
  ])
).start();

// Auto-navigate to tracking after 8 seconds
const timer = setTimeout(() => {
  handleStartRide();
}, 8000);

return () => clearTimeout(timer);
}, []);

const handleStartRide = () => {
startTracking();
navigation.replace('RideTracking');
};

const handleCancel = () => {
cancelRide();
navigation.goBack();
};

if (!driver) {
return (
<View style={styles.container}>
<Text>No driver found</Text>
</View>
);
}

return (
<View style={styles.container}>
{/* Map Background Placeholder */}
<View style={styles.mapBackground}>
<View style={styles.mapPlaceholder}>
<Ionicons name="map" size={60} color="#6c63ff30" />
<Text style={styles.mapText}>Map View</Text>
</View>
</View>

  {/* Driver Card */}
  <Animated.View 
    style={[
      styles.driverCard,
      { transform: [{ translateY: slideAnim }], opacity: fadeAnim }
    ]}
  >
    {/* Driver Photo */}
    <View style={styles.driverPhotoSection}>
      <Animated.View style={[styles.driverPhotoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.driverPhoto}>
          <Ionicons name="person" size={40} color="#6c63ff" />
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#00b894" />
        </View>
      </Animated.View>
      <Text style={styles.driverName}>{driver.name}</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={14} color="#f39c12" />
        <Text style={styles.ratingText}>{driver.rating}</Text>
        <Text style={styles.tripsText}>• {driver.trips} trips</Text>
      </View>
    </View>

    {/* Car Info */}
    <View style={styles.carSection}>
      <View style={styles.carInfo}>
        <View style={styles.carIcon}>
          <Ionicons name="car-sport" size={24} color={driver.color || '#2e7d32'} />
        </View>
        <View style={styles.carDetails}>
          <Text style={styles.carName}>{driver.car || 'Toyota Camry'}</Text>
          <Text style={styles.carPlate}>{driver.plate || 'GR 0000'}</Text>
        </View>
      </View>
    </View>

    {/* Contact Options */}
    <View style={styles.contactRow}>
      <TouchableOpacity style={styles.contactButton}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#6c63ff" />
        <Text style={styles.contactText}>Message</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contactButton}>
        <Ionicons name="call" size={24} color="#6c63ff" />
        <Text style={styles.contactText}>Call</Text>
      </TouchableOpacity>
    </View>

    {/* Ride Info */}
    <View style={styles.rideInfoSection}>
      <View style={styles.rideInfoRow}>
        <View style={styles.rideInfoItem}>
          <Text style={styles.rideInfoLabel}>Pickup</Text>
          <Text style={styles.rideInfoValue}>{pickup?.name || 'Current Location'}</Text>
        </View>
      </View>
      <View style={styles.rideDivider} />
      <View style={styles.rideInfoRow}>
        <View style={styles.rideInfoItem}>
          <Text style={styles.rideInfoLabel}>Dropoff</Text>
          <Text style={styles.rideInfoValue}>{dropoff?.name || 'Destination'}</Text>
        </View>
      </View>
    </View>

    {/* Price */}
    <View style={styles.priceSection}>
      <Text style={styles.priceLabel}>Estimated Price</Text>
      <Text style={styles.priceValue}>GHS {estimatedPrice}</Text>
    </View>

    {/* Start Ride Button */}
    <TouchableOpacity style={styles.startButton} onPress={handleStartRide} activeOpacity={0.9}>
      <LinearGradient
        colors={['#00b894', '#00a185']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.startGradient}
      >
        <Ionicons name="navigate" size={22} color="#fff" />
        <Text style={styles.startText}>Start Ride</Text>
      </LinearGradient>
    </TouchableOpacity>

    {/* Cancel */}
    <TouchableOpacity style={styles.cancelLink} onPress={handleCancel}>
      <Text style={styles.cancelText}>Cancel Ride</Text>
    </TouchableOpacity>
  </Animated.View>

  {/* Header */}
  <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
    <View style={styles.headerContent}>
      <View style={styles.successBadge}>
        <Ionicons name="checkmark-circle" size={20} color="#00b894" />
      </View>
      <View>
        <Text style={styles.headerTitle}>Driver Found!</Text>
        <Text style={styles.headerSubtitle}>{driver.name} is on the way</Text>
      </View>
    </View>
  </Animated.View>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f8f8fc',
},
mapBackground: {
flex: 1,
backgroundColor: '#e8e8ed',
},
mapPlaceholder: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
},
mapText: {
fontSize: 16,
color: '#999',
marginTop: 10,
},
header: {
position: 'absolute',
top: Platform.OS === 'ios' ? 60 : 48,
left: 20,
right: 20,
},
headerContent: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#fff',
borderRadius: 16,
padding: 16,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.1,
shadowRadius: 12,
elevation: 5,
},
successBadge: {
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: '#00b89420',
alignItems: 'center',
justifyContent: 'center',
marginRight: 12,
},
headerTitle: {
fontSize: 18,
fontWeight: '700',
color: '#1a1a2e',
},
headerSubtitle: {
fontSize: 13,
color: '#666',
marginTop: 2,
},
driverCard: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
backgroundColor: '#fff',
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
padding: 24,
paddingBottom: Platform.OS === 'ios' ? 34 : 24,
shadowColor: '#000',
shadowOffset: { width: 0, height: -8 },
shadowOpacity: 0.15,
shadowRadius: 20,
elevation: 10,
},
driverPhotoSection: {
alignItems: 'center',
marginBottom: 20,
},
driverPhotoContainer: {
position: 'relative',
marginBottom: 12,
},
driverPhoto: {
width: 80,
height: 80,
borderRadius: 40,
backgroundColor: '#6c63ff20',
alignItems: 'center',
justifyContent: 'center',
borderWidth: 3,
borderColor: '#fff',
shadowColor: '#6c63ff',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
elevation: 5,
},
verifiedBadge: {
position: 'absolute',
bottom: 0,
right: 0,
backgroundColor: '#fff',
borderRadius: 10,
},
driverName: {
fontSize: 20,
fontWeight: '700',
color: '#1a1a2e',
marginBottom: 4,
},
ratingRow: {
flexDirection: 'row',
alignItems: 'center',
},
ratingText: {
fontSize: 14,
fontWeight: '600',
color: '#1a1a2e',
marginLeft: 4,
},
tripsText: {
fontSize: 14,
color: '#999',
marginLeft: 4,
},
carSection: {
backgroundColor: '#f8f8fc',
borderRadius: 16,
padding: 16,
marginBottom: 20,
},
carInfo: {
flexDirection: 'row',
alignItems: 'center',
},
carIcon: {
width: 50,
height: 50,
borderRadius: 14,
backgroundColor: '#f0f0f5',
alignItems: 'center',
justifyContent: 'center',
marginRight: 14,
},
carDetails: {
flex: 1,
},
carName: {
fontSize: 16,
fontWeight: '600',
color: '#1a1a2e',
},
carPlate: {
fontSize: 14,
color: '#666',
marginTop: 2,
},
contactRow: {
flexDirection: 'row',
marginBottom: 20,
gap: 12,
},
contactButton: {
flex: 1,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#6c63ff15',
borderRadius: 14,
paddingVertical: 14,
gap: 8,
},
contactText: {
fontSize: 14,
fontWeight: '600',
color: '#6c63ff',
},
rideInfoSection: {
backgroundColor: '#f8f8fc',
borderRadius: 16,
padding: 16,
marginBottom: 20,
},
rideInfoRow: {
paddingVertical: 4,
},
rideInfoItem: {
flexDirection: 'row',
alignItems: 'center',
},
rideInfoLabel: {
fontSize: 11,
fontWeight: '600',
color: '#aaa',
letterSpacing: 1,
width: 60,
},
rideInfoValue: {
fontSize: 14,
fontWeight: '600',
color: '#1a1a2e',
flex: 1,
},
rideDivider: {
height: 1,
backgroundColor: '#eee',
marginVertical: 8,
},
priceSection: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
marginBottom: 20,
},
priceLabel: {
fontSize: 14,
fontWeight: '600',
color: '#666',
},
priceValue: {
fontSize: 22,
fontWeight: '800',
color: '#1a1a2e',
},
startButton: {
borderRadius: 18,
overflow: 'hidden',
marginBottom: 12,
},
startGradient: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
paddingVertical: 18,
gap: 10,
},
startText: {
fontSize: 18,
fontWeight: '700',
color: '#fff',
},
cancelLink: {
alignItems: 'center',
paddingVertical: 8,
},
cancelText: {
fontSize: 14,
fontWeight: '600',
color: '#e74c3c',
},
});

export default DriverFoundScreen;