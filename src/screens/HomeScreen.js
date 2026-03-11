import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';

const isWeb = Platform.OS === 'web';
const { width, height } = Dimensions.get('window');

let MapView = null;
let Marker = null;
if (!isWeb) {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  } catch (e) {}
}

const ACCRA_REGION = {
  latitude: 5.6037,
  longitude: -0.187,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035,
};

const SERVICES = [
  { id: '1', name: 'Ride', icon: 'car-sport', color: colors.primary, bgColor: colors.primary + '12', screen: 'RideBooking', isTab: false },
  { id: '2', name: 'Reserve', icon: 'calendar', color: '#9B59B6', bgColor: '#9B59B612', screen: 'ReserveRide', isTab: false },
];

const SAVED_PLACES = [
  { id: '1', icon: 'home', title: 'Home', address: 'East Legon, Accra', color: colors.primary },
  { id: '2', icon: 'briefcase', title: 'Work', address: 'Airport City, Accra', color: '#FF6B35' },
];

const RECENT_PLACES = [
  { id: '1', name: 'Accra Mall', address: 'Tetteh Quarshie, Accra', time: '15 min ago' },
  { id: '2', name: 'Kotoka International Airport', address: 'Airport, Accra', time: '2 hours ago' },
  { id: '3', name: 'University of Ghana', address: 'Legon, Accra', time: 'Yesterday' },
];

const mapStyle = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const bottomSheetY = useRef(new Animated.Value(100)).current;
  const topBarOpacity = useRef(new Animated.Value(0)).current;
  const searchScale = useRef(new Animated.Value(0.95)).current;
  const serviceAnims = SERVICES.map(() => useRef(new Animated.Value(0)).current);

  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.timing(topBarOpacity, {
      toValue: 1, duration: 600, delay: 300, useNativeDriver: true,
    }).start();

    Animated.spring(bottomSheetY, {
      toValue: 0, tension: 50, friction: 10, delay: 200, useNativeDriver: true,
    }).start();

    Animated.spring(searchScale, {
      toValue: 1, tension: 60, friction: 8, delay: 500, useNativeDriver: true,
    }).start();

    Animated.stagger(100,
      serviceAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1, tension: 60, friction: 8, useNativeDriver: true,
        })
      )
    ).start();
  };

  // Safe navigation that works from nested navigators
  const goTo = (screenName) => {
    try {
      // Try parent navigator first (root stack)
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate(screenName);
      } else {
        navigation.navigate(screenName);
      }
    } catch (error) {
      // Final fallback: try root navigation
      try {
        navigation.navigate(screenName);
      } catch (e) {
        console.warn('Navigation failed for:', screenName);
      }
    }
  };

  const handleServicePress = (service) => {
    if (service.isTab) {
      // Navigate within tab navigator
      navigation.navigate(service.screen);
    } else {
      // Navigate to stack screen
      goTo(service.screen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {isWeb || !MapView ? (
        <View style={[styles.map, { backgroundColor: colors.gray200 }]}>
          <View style={styles.webMapFallback}>
            <MaterialCommunityIcons name="map-marker" size={60} color={colors.primary} />
            <Text style={styles.webMapText}>Accra, Ghana</Text>
            <Text style={styles.webMapSubtext}>Map view available on mobile</Text>
          </View>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={ACCRA_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          customMapStyle={mapStyle}
        >
          <Marker coordinate={{ latitude: 5.6037, longitude: -0.187 }}>
            <View style={styles.markerContainer}>
              <LinearGradient
                colors={[colors.primary, '#00D45A']}
                style={styles.markerDot}
              >
                <View style={styles.markerInner} />
              </LinearGradient>
              <View style={styles.markerPulse} />
            </View>
          </Marker>
        </MapView>
      )}

      {/* Top Bar */}
      <Animated.View style={[styles.topBar, { opacity: topBarOpacity }]}>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.8}
          onPress={() => goTo('Menu')}
        >
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting} 👋</Text>
          <Text style={styles.userName}>Kwame</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.8}
          onPress={() => goTo('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY: bottomSheetY }] }]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          {/* Search Bar */}
          <Animated.View style={{ transform: [{ scale: searchScale }] }}>
            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.9}
              onPress={() => goTo('RideBooking')}
            >
              <View style={styles.searchIconContainer}>
                <Ionicons name="search" size={20} color={colors.white} />
              </View>
              <View style={styles.searchTextContainer}>
                <Text style={styles.searchPlaceholder}>Where are you going?</Text>
<Text style={styles.searchSubtext}>Ride • Reserve</Text>
              </View>
              <View style={styles.searchTimeContainer}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.searchTimeText}>Now</Text>
                <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Services */}
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesGrid}>
              {SERVICES.map((service, index) => (
                <Animated.View
                  key={service.id}
                  style={{
                    opacity: serviceAnims[index],
                    transform: [{
                      translateY: serviceAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.serviceCard}
                    activeOpacity={0.75}
                    onPress={() => handleServicePress(service)}
                  >
                    <View style={[styles.serviceIconBg, { backgroundColor: service.bgColor }]}>
                      <Ionicons name={service.icon} size={26} color={service.color} />
                    </View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Saved Places */}
          <View style={styles.savedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Places</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
            </View>
            {SAVED_PLACES.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.placeItem}
                activeOpacity={0.7}
                onPress={() => goTo('RideBooking')}
              >
                <View style={[styles.placeIconContainer, { backgroundColor: place.color + '12' }]}>
                  <Ionicons name={place.icon} size={20} color={place.color} />
                </View>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeTitle}>{place.title}</Text>
                  <Text style={styles.placeAddress}>{place.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
            </View>
            {RECENT_PLACES.map((place, index) => (
              <TouchableOpacity
                key={place.id}
                style={[styles.recentItem, index === RECENT_PLACES.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => goTo('RideBooking')}
              >
                <View style={styles.recentIconContainer}>
                  <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{place.name}</Text>
                  <Text style={styles.recentAddress}>{place.address}</Text>
                </View>
                <Text style={styles.recentTime}>{place.time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Promo Banner */}
          <TouchableOpacity style={styles.promoBanner} activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.secondary, '#16213E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promoGradient}
            >
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>First Ride Free! 🎉</Text>
                <Text style={styles.promoDescription}>Use code ZENTERNEW for your first ride</Text>
                <View style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Apply Code</Text>
                </View>
              </View>
              <View style={styles.promoIconContainer}>
                <MaterialCommunityIcons name="ticket-percent" size={50} color={colors.accent} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      <TouchableOpacity style={styles.myLocationFab} activeOpacity={0.85}>
        <Ionicons name="navigate" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  map: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.45 },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  markerDot: {
    width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 6, elevation: 5,
  },
  markerInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  markerPulse: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary + '20',
  },
  topBar: {
    position: 'absolute', top: Platform.OS === 'ios' ? 55 : 42,
    left: 0, right: 0, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
  },
  menuButton: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  greetingContainer: { alignItems: 'center' },
  greetingText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  userName: { fontSize: 17, fontWeight: '700', color: colors.text },
  notificationButton: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  notificationDot: {
    position: 'absolute', top: 12, right: 13, width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.error, borderWidth: 1.5, borderColor: colors.white,
  },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0, top: height * 0.36,
    backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: colors.black, shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 20,
  },
  handleContainer: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.gray300 },
  sheetContent: { paddingHorizontal: 20 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray100,
    borderRadius: 16, padding: 14, marginBottom: 24,
    borderWidth: 1, borderColor: colors.gray200,
  },
  searchIconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  searchTextContainer: { flex: 1 },
  searchPlaceholder: { fontSize: 16, fontWeight: '600', color: colors.text },
  searchSubtext: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  searchTimeContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  searchTimeText: { fontSize: 13, fontWeight: '600', color: colors.text, marginHorizontal: 4 },
  servicesSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  seeAllText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  servicesGrid: { flexDirection: 'row', justifyContent: 'flex-start', gap: 20 },
  serviceCard: { alignItems: 'center', width: (width - 72) / 2 },
  serviceIconBg: {
    width: 58, height: 58, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  serviceName: { fontSize: 13, fontWeight: '600', color: colors.text },
  savedSection: { marginBottom: 24 },
  placeItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray50,
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  placeIconContainer: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  placeInfo: { flex: 1 },
  placeTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  placeAddress: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  recentSection: { marginBottom: 24 },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  recentIconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 15, fontWeight: '600', color: colors.text },
  recentAddress: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  recentTime: { fontSize: 12, color: colors.textLight, fontWeight: '500' },
  promoBanner: {
    marginBottom: 10, borderRadius: 20, overflow: 'hidden',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  promoGradient: {
    flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20,
  },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 18, fontWeight: '800', color: colors.white, marginBottom: 6 },
  promoDescription: {
    fontSize: 13, color: colors.white + 'CC', marginBottom: 14, lineHeight: 18,
  },
  promoButton: {
    backgroundColor: colors.accent, paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 12, alignSelf: 'flex-start',
  },
  promoButtonText: { fontSize: 13, fontWeight: '700', color: colors.secondary },
  promoIconContainer: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: colors.white + '15',
    alignItems: 'center', justifyContent: 'center', marginLeft: 10,
  },
  myLocationFab: {
    position: 'absolute', right: 20, top: height * 0.36 - 60,
    width: 48, height: 48, borderRadius: 16, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
  },
  webMapFallback: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gray200,
  },
  webMapText: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 16 },
  webMapSubtext: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
});

export default HomeScreen;