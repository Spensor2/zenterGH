import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DATES = ['Today', 'Tomorrow', 'Fri 14', 'Sat 15', 'Sun 16', 'Mon 17'];
const TIMES = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM',
];

const ReserveScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(3);
  const [pickup, setPickup] = useState('East Legon, Accra');
  const [dropoff, setDropoff] = useState('Kotoka Airport');

  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(40)).current;
  const clockRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(clockRotate, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const clockSpin = clockRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reserve a Ride</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <Animated.View
          style={[
            styles.heroCard,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          <View style={styles.heroIconSection}>
            <View style={styles.heroIconBg}>
              <Animated.View style={{ transform: [{ rotate: clockSpin }] }}>
                <Ionicons name="time" size={40} color="#9B59B6" />
              </Animated.View>
            </View>
          </View>
          <Text style={styles.heroTitle}>Plan Ahead</Text>
          <Text style={styles.heroDesc}>
            Schedule your ride up to 7 days in advance.{'\n'}
            Your driver will be there on time.
          </Text>
        </Animated.View>

        {/* Route Card */}
        <Animated.View
          style={[
            styles.routeCard,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Route</Text>
          <TouchableOpacity style={styles.routeRow} activeOpacity={0.7}>
            <View style={styles.routeDotGreen} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>PICKUP</Text>
              <Text style={styles.routeValue}>{pickup}</Text>
            </View>
            <Ionicons name="pencil" size={16} color="#6c63ff" />
          </TouchableOpacity>
          <View style={styles.routeConnector} />
          <TouchableOpacity style={styles.routeRow} activeOpacity={0.7}>
            <View style={styles.routeDotRed} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>DROPOFF</Text>
              <Text style={styles.routeValue}>{dropoff}</Text>
            </View>
            <Ionicons name="pencil" size={16} color="#6c63ff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Date Selection */}
        <Animated.View style={{ opacity: contentFade }}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {DATES.map((date, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dateChip, selectedDate === i && styles.dateChipSelected]}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(i)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === i && styles.dateTextSelected,
                  ]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Time Selection */}
        <Animated.View style={{ opacity: contentFade }}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIMES.map((time, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.timeChip, selectedTime === i && styles.timeChipSelected]}
                activeOpacity={0.7}
                onPress={() => setSelectedTime(i)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === i && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        <Animated.View style={[styles.summaryCard, { opacity: contentFade }]}>
          <View style={styles.summaryRow}>
            <Ionicons name="calendar" size={16} color="#9B59B6" />
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{DATES[selectedDate]}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Ionicons name="time" size={16} color="#9B59B6" />
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{TIMES[selectedTime]}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Ionicons name="car-sport" size={16} color="#9B59B6" />
            <Text style={styles.summaryLabel}>Est. Fare</Text>
            <Text style={styles.summaryValue}>GHS 25-35</Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View
        style={[styles.confirmContainer, { transform: [{ scale: buttonScale }] }]}
      >
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={['#9B59B6', '#8E44AD']}
            style={styles.confirmGradient}
          >
            <Ionicons name="calendar" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.confirmText}>Schedule Ride</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 12,
  },

  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },

  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },

  heroCard: {
    backgroundColor: '#f5f0ff', borderRadius: 24, padding: 28, alignItems: 'center',
    marginBottom: 28, borderWidth: 1, borderColor: '#e8e0ff',
  },

  heroIconSection: { marginBottom: 16 },

  heroIconBg: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 5,
  },

  heroTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginBottom: 8 },

  heroDesc: {
    fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22,
  },

  routeCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },

  routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },

  routeDotGreen: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#00b894', marginRight: 14,
  },

  routeDotRed: {
    width: 12, height: 12, borderRadius: 4, backgroundColor: '#e74c3c', marginRight: 14,
  },

  routeInfo: { flex: 1 },
  routeLabel: { fontSize: 10, fontWeight: '700', color: '#aaa', letterSpacing: 1.5 },
  routeValue: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginTop: 2 },

  routeConnector: {
    width: 2, height: 20, backgroundColor: '#e8e8ed', marginLeft: 5, borderRadius: 1,
  },

  dateScroll: { marginBottom: 28 },

  dateChip: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
    backgroundColor: '#fff', marginRight: 10, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },

  dateChipSelected: { borderColor: '#9B59B6', backgroundColor: '#f5f0ff' },
  dateText: { fontSize: 14, fontWeight: '600', color: '#666' },
  dateTextSelected: { color: '#9B59B6', fontWeight: '700' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 28 },

  timeChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#fff', marginRight: 8, marginBottom: 8,
    borderWidth: 1.5, borderColor: 'transparent',
  },

  timeChipSelected: { borderColor: '#9B59B6', backgroundColor: '#f5f0ff' },
  timeText: { fontSize: 13, fontWeight: '600', color: '#666' },
  timeTextSelected: { color: '#9B59B6', fontWeight: '700' },

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },

  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  summaryLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#888', marginLeft: 12 },
  summaryValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  summaryDivider: { height: 1, backgroundColor: '#f5f5fa' },

  confirmContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20, right: 20,
  },

  confirmBtn: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#9B59B6', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },

  confirmGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 18,
  },

  confirmText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});

export default ReserveScreen;