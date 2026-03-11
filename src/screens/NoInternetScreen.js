import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Linking, Alert, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../context/NetworkContext';
import { usePendingRides } from '../context/PendingRidesContext';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');

const USSD_CODES = [
  { id: '1', title: 'Quick Book', code: '*713*1#', icon: 'car-sport', color: '#00b894' },
  { id: '2', title: 'Schedule', code: '*713*2#', icon: 'calendar', color: '#9B59B6' },
  { id: '3', title: 'Status', code: '*713*3#', icon: 'time', color: '#6c63ff' },
];

const DATES = ['Today', 'Tomorrow', 'Fri 14', 'Sat 15', 'Sun 16'];
const TIMES = ['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

const NoInternetScreen = ({ navigation }) => {
  const { checkNetworkStatus, isOffline } = useNetwork();
  const { hasPendingRides, pendingCount, addPendingRide } = usePendingRides();

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(2);
  const [pickup] = useState('Current Location');
  const [dropoff, setDropoff] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (!isOffline && showBackOnline) {
      const timer = setTimeout(() => setShowBackOnline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, showBackOnline]);

  const handleRetry = async () => {
    setIsChecking(true);
    const isOnline = await checkNetworkStatus();
    setIsChecking(false);
    if (isOnline) setShowBackOnline(true);
  };

  const handleDialUSSD = (code) => {
    const telUrl = 'tel:' + code;
    Linking.canOpenURL(telUrl).then((supported) => {
      if (supported) Linking.openURL(telUrl);
      else Alert.alert('USSD Not Supported', 'Your device does not support USSD codes.', [{ text: 'OK' }]);
    });
  };

  const handleBookRide = () => {
    Alert.alert('Book a Ride', "You're offline. Would you like to:", [
      { text: 'Queue for Now', onPress: () => {
        if (!dropoff) { setShowSchedule(true); return; }
        addPendingRide({ pickup, dropoff, date: 'Now', time: 'Immediately', status: 'pending' });
        Alert.alert('Ride Queued!', 'Your ride to ' + dropoff + ' has been queued.', [{ text: 'OK' }]);
      }},
      { text: 'Schedule for Later', onPress: () => setShowSchedule(true) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleScheduleRide = () => {
    if (!dropoff) { Alert.alert('Missing Destination', 'Please select a destination.', [{ text: 'OK' }]); return; }
    addPendingRide({ pickup, dropoff, date: DATES[selectedDate], time: TIMES[selectedTime], status: 'pending' });
    Alert.alert('Ride Scheduled!', 'Your ride to ' + dropoff + ' has been queued.', [{ text: 'OK' }]);
    setShowSchedule(false);
    setDropoff('');
  };

  const renderScheduleSection = () => {
    return (
      <View style={styles.scheduleContainer}>
        <View style={styles.clockSection}>
          <View style={styles.clockCircle}>
            <Ionicons name="time" size={36} color="#9B59B6" />
          </View>
          <Text style={styles.scheduleTitle}>Schedule Your Ride</Text>
          <Text style={styles.scheduleSubtitle}>Book for later</Text>
        </View>
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <View style={styles.routeInput}>
              <Text style={styles.inputLabel}>PICKUP</Text>
              <Text style={styles.inputValue}>{pickup}</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.dotRed} />
            <View style={styles.routeInput}>
              <Text style={styles.inputLabel}>DROPOFF</Text>
              <Text style={styles.inputPlaceholder}>{dropoff || 'Select destination'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.quickPlaces}>
          <Text style={styles.quickPlacesLabel}>Quick Destinations</Text>
          <View style={styles.quickPlacesRow}>
            {['Accra Mall', 'Airport', 'Legon', 'Osu'].map((place) => (
              <TouchableOpacity key={place} style={[styles.quickPlaceChip, dropoff === place && styles.quickPlaceChipSelected]} onPress={() => setDropoff(place)}>
                <Text style={[styles.quickPlaceText, dropoff === place && styles.quickPlaceTextSelected]}>{place}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.selectionSection}>
          <Text style={styles.selectionLabel}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {DATES.map((date, i) => (
              <TouchableOpacity key={i} style={[styles.dateChip, selectedDate === i && styles.dateChipSelected]} onPress={() => setSelectedDate(i)}>
                <Text style={[styles.dateText, selectedDate === i && styles.dateTextSelected]}>{date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.selectionSection}>
          <Text style={styles.selectionLabel}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIMES.map((time, i) => (
              <TouchableOpacity key={i} style={[styles.timeChip, selectedTime === i && styles.timeChipSelected]} onPress={() => setSelectedTime(i)}>
                <Text style={[styles.timeText, selectedTime === i && styles.timeTextSelected]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleRide}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.scheduleButtonText}>Schedule Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSchedule(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {showBackOnline && (
        <View style={styles.backOnlineBanner}>
          <Ionicons name="checkmark-circle" size={22} color="#00b894" />
          <Text style={styles.backOnlineText}>You are back online!</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={[styles.scrollContent, { opacity: fadeAnim }]} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.iconSection}>
          <View style={styles.wifiCircle}>
            <Ionicons name="wifi" size={40} color={colors.primary} />
          </View>
        </View>
        <View style={styles.titleSection}>
          <Text style={styles.title}>You are Offline</Text>
          <Text style={styles.subtitle}>Some features are limited.{'\n'}But you can still schedule rides!</Text>
        </View>
        {hasPendingRides && (
          <View style={styles.pendingBadge}>
            <Ionicons name="time" size={16} color={colors.accent} />
            <Text style={styles.pendingText}>{pendingCount} ride{pendingCount > 1 ? 's' : ''} queued</Text>
          </View>
        )}
        <View style={styles.ussdSection}>
          <Text style={styles.sectionTitle}>Use USSD Codes</Text>
          <View style={styles.ussdGrid}>
            {USSD_CODES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.ussdCard} activeOpacity={0.7} onPress={() => handleDialUSSD(item.code)}>
                <View style={[styles.ussdIconBg, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.ussdCardTitle}>{item.title}</Text>
                <Text style={styles.ussdCode}>{item.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {!showSchedule && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleBookRide}>
            <Ionicons name="car-sport" size={22} color={colors.white} />
            <Text style={styles.primaryButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
        {showSchedule ? renderScheduleSection() : (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowSchedule(true)}>
            <Ionicons name="calendar" size={22} color="#9B59B6" />
            <Text style={styles.secondaryButtonText}>Schedule a Ride</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry} disabled={isChecking}>
          {isChecking ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <View style={styles.retryContent}>
              <Ionicons name="refresh" size={20} color={colors.white} />
              <Text style={styles.retryButtonText}>Check Connection</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.helpSection}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textLight} />
          <Text style={styles.helpText}>Scheduled rides will be booked automatically when you are back online</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  backOnlineBanner: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#00b894', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, zIndex: 1000 },
  backOnlineText: { fontSize: 16, fontWeight: '700', color: colors.white, marginLeft: 8 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  iconSection: { alignItems: 'center', marginBottom: 20 },
  wifiCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  titleSection: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent + '15', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, alignSelf: 'center', marginBottom: 24 },
  pendingText: { fontSize: 14, fontWeight: '600', color: colors.accent, marginLeft: 8 },
  ussdSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  ussdGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  ussdCard: { width: (width - 72) / 3, backgroundColor: colors.white, borderRadius: 14, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  ussdIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  ussdCardTitle: { fontSize: 12, fontWeight: '700', color: colors.text },
  ussdCode: { fontSize: 10, fontWeight: '600', color: colors.textSecondary, marginTop: 2 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 14, marginBottom: 12, gap: 10 },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9B59B620', paddingVertical: 16, borderRadius: 14, marginBottom: 16, gap: 10 },
  secondaryButtonText: { fontSize: 16, fontWeight: '700', color: '#9B59B6' },
  retryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6c63ff', paddingVertical: 14, borderRadius: 14 },
  retryContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  retryButtonText: { fontSize: 14, fontWeight: '700', color: colors.white },
  helpSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingHorizontal: 10 },
  helpText: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginLeft: 6, lineHeight: 16 },
  scheduleContainer: { backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  clockSection: { alignItems: 'center', marginBottom: 20 },
  clockCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#9B59B615', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  scheduleTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  scheduleSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  routeCard: { backgroundColor: '#f8f8fc', borderRadius: 16, padding: 16, marginBottom: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00b894', marginRight: 12 },
  dotRed: { width: 10, height: 10, borderRadius: 3, backgroundColor: '#e74c3c', marginRight: 12 },
  routeInput: { flex: 1 },
  inputLabel: { fontSize: 9, fontWeight: '700', color: '#aaa', letterSpacing: 1 },
  inputValue: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 2 },
  inputPlaceholder: { fontSize: 14, fontWeight: '600', color: '#ccc', marginTop: 2 },
  routeConnector: { width: 2, height: 20, backgroundColor: '#e8e8ed', marginLeft: 4, marginVertical: 6 },
  quickPlaces: { marginBottom: 16 },
  quickPlacesLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  quickPlacesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickPlaceChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f5' },
  quickPlaceChipSelected: { backgroundColor: '#9B59B6' },
  quickPlaceText: { fontSize: 12, fontWeight: '600', color: '#666' },
  quickPlaceTextSelected: { color: colors.white },
  selectionSection: { marginBottom: 16 },
  selectionLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  dateScroll: { marginBottom: 4 },
  dateChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.white, marginRight: 8, borderWidth: 1.5, borderColor: 'transparent' },
  dateChipSelected: { borderColor: '#9B59B6', backgroundColor: '#9B59B615' },
  dateText: { fontSize: 13, fontWeight: '600', color: '#666' },
  dateTextSelected: { color: '#9B59B6', fontWeight: '700' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.white, borderWidth: 1.5, borderColor: 'transparent' },
  timeChipSelected: { borderColor: '#9B59B6', backgroundColor: '#9B59B615' },
  timeText: { fontSize: 12, fontWeight: '600', color: '#666' },
  timeTextSelected: { color: '#9B59B6', fontWeight: '700' },
  scheduleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#9B59B6', paddingVertical: 16, borderRadius: 14, gap: 10 },
  scheduleButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  cancelButton: { alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  cancelText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
});

export default NoInternetScreen;

