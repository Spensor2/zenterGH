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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const RIDE_CATEGORIES = [
  { id: 'all', label: 'All Rides', icon: 'car-sport', active: true },
  { id: 'completed', label: 'Completed', icon: 'checkmark-circle', color: '#00b894' },
  { id: 'cancelled', label: 'Cancelled', icon: 'close-circle', color: '#e74c3c' },
  { id: 'scheduled', label: 'Scheduled', icon: 'calendar', color: '#6c63ff' },
];

const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent', icon: 'time-outline' },
  { id: 'price_high', label: 'Price: High to Low', icon: 'trending-down' },
  { id: 'price_low', label: 'Price: Low to High', icon: 'trending-up' },
  { id: 'rating', label: 'Highest Rated', icon: 'star-outline' },
];

const DATE_RANGES = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: '3months', label: 'Last 3 Months' },
  { id: 'year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
];

const RideFiltersScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [selectedDate, setSelectedDate] = useState('month');
  const [showRated, setShowRated] = useState(false);
  const [showReceipts, setShowReceipts] = useState(true);

  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  const catAnims = RIDE_CATEGORIES.map(() => ({
    scale: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(contentSlide, {
          toValue: 0, duration: 500, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.stagger(80,
          catAnims.map((a) =>
            Animated.spring(a.scale, {
              toValue: 1, friction: 6, tension: 80, useNativeDriver: true,
            })
          )
        ),
      ]),
      Animated.spring(buttonScale, {
        toValue: 1, friction: 6, tension: 80, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleApply = () => {
    navigation.goBack();
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedSort('recent');
    setSelectedDate('month');
    setShowRated(false);
    setShowReceipts(true);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
          <Text style={styles.sectionTitle}>Ride Status</Text>
          <View style={styles.catGrid}>
            {RIDE_CATEGORIES.map((cat, i) => (
              <Animated.View
                key={cat.id}
                style={{ transform: [{ scale: catAnims[i].scale }], flex: 1, marginHorizontal: 4 }}
              >
                <TouchableOpacity
                  style={[
                    styles.catCard,
                    selectedCategory === cat.id && styles.catCardActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={22}
                    color={selectedCategory === cat.id ? '#fff' : (cat.color || '#666')}
                  />
                  <Text
                    style={[
                      styles.catLabel,
                      selectedCategory === cat.id && styles.catLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Sort By */}
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.sortGroup}>
            {SORT_OPTIONS.map((opt, i) => (
              <React.Fragment key={opt.id}>
                <TouchableOpacity
                  style={styles.sortRow}
                  activeOpacity={0.7}
                  onPress={() => setSelectedSort(opt.id)}
                >
                  <Ionicons name={opt.icon} size={20} color="#666" />
                  <Text style={styles.sortLabel}>{opt.label}</Text>
                  <View style={[styles.radio, selectedSort === opt.id && styles.radioActive]}>
                    {selectedSort === opt.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
                {i < SORT_OPTIONS.length - 1 && <View style={styles.sortDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Date Range */}
        <Animated.View style={{ opacity: contentFade }}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DATE_RANGES.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.dateChip,
                  selectedDate === range.id && styles.dateChipActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(range.id)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === range.id && styles.dateTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Toggles */}
        <Animated.View style={[styles.toggleSection, { opacity: contentFade }]}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.toggleGroup}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Ionicons name="star-outline" size={20} color="#f39c12" />
                <Text style={styles.toggleLabel}>Only rated rides</Text>
              </View>
              <Switch
                value={showRated}
                onValueChange={setShowRated}
                trackColor={{ false: '#e0e0e0', true: '#6c63ff' }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.toggleDivider} />
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Ionicons name="receipt-outline" size={20} color="#0984e3" />
                <Text style={styles.toggleLabel}>Show receipts</Text>
              </View>
              <Switch
                value={showReceipts}
                onValueChange={setShowReceipts}
                trackColor={{ false: '#e0e0e0', true: '#6c63ff' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Apply Button */}
      <Animated.View style={[styles.applyContainer, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity style={styles.applyBtn} activeOpacity={0.85} onPress={handleApply}>
          <LinearGradient
            colors={['#1a1a2e', '#2d2d5e']}
            style={styles.applyGradient}
          >
            <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.applyText}>Apply Filters</Text>
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
  resetText: { fontSize: 15, fontWeight: '600', color: '#6c63ff' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 14, marginTop: 24,
  },

  // Categories
  catGrid: { flexDirection: 'row', marginBottom: 8 },

  catCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },

  catCardActive: { backgroundColor: '#1a1a2e', borderColor: '#1a1a2e' },
  catLabel: { fontSize: 11, fontWeight: '600', color: '#666', marginTop: 8, textAlign: 'center' },
  catLabelActive: { color: '#fff' },

  // Sort
  sortGroup: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },

  sortRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
  },

  sortLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginLeft: 14 },

  sortDivider: { height: 1, backgroundColor: '#f5f5fa', marginLeft: 50 },

  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },

  radioActive: { borderColor: '#6c63ff' },

  radioDot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#6c63ff',
  },

  // Date
  dateChip: {
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14,
    backgroundColor: '#fff', marginRight: 10, borderWidth: 2, borderColor: 'transparent',
  },

  dateChipActive: { borderColor: '#6c63ff', backgroundColor: '#f0eeff' },
  dateText: { fontSize: 14, fontWeight: '600', color: '#666' },
  dateTextActive: { color: '#6c63ff', fontWeight: '700' },

  // Toggles
  toggleSection: { marginBottom: 20 },

  toggleGroup: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16,
  },

  toggleInfo: { flexDirection: 'row', alignItems: 'center' },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginLeft: 14 },
  toggleDivider: { height: 1, backgroundColor: '#f5f5fa', marginLeft: 50 },

  // Apply
  applyContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20, right: 20,
  },

  applyBtn: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#1a1a2e', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 10,
  },

  applyGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 18,
  },

  applyText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});

export default RideFiltersScreen;