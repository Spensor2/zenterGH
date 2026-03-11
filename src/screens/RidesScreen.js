import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const pastRides = [
  {
    id: '1',
    route: 'Osu → Spintex',
    date: 'Mar 6, 2026',
    time: '2:30 PM',
    price: 'GHS 18',
    status: 'Completed',
  },
  {
    id: '2',
    route: 'Airport → East Legon',
    date: 'Mar 3, 2026',
    time: '11:00 AM',
    price: 'GHS 42',
    status: 'Completed',
  },
  {
    id: '3',
    route: 'Madina → Circle',
    date: 'Feb 28, 2026',
    time: '8:15 AM',
    price: 'GHS 15',
    status: 'Completed',
  },
  {
    id: '4',
    route: 'Tema → Accra Mall',
    date: 'Feb 20, 2026',
    time: '4:00 PM',
    price: 'GHS 30',
    status: 'Cancelled',
  },
];

const EmptyUpcoming = ({ onLearnMore, onSchedule }) => {
  const clockAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const carAnim = useRef(new Animated.Value(-60)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation sequence
    Animated.sequence([
      // Fade in and slide up the container
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Button spring in
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous clock hand rotation
    Animated.loop(
      Animated.timing(clockAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // Pulse animation for the icon background
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Car driving animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(carAnim, {
          toValue: 60,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(carAnim, {
          toValue: -60,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Staggered dots animation
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
          Animated.delay(800 - delay),
        ])
      ).start();
    };

    animateDot(dotAnim1, 0);
    animateDot(dotAnim2, 200);
    animateDot(dotAnim3, 400);

    // Ring expand animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(ringAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    ).start();
  }, []);

  const clockRotation = clockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringScale = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const ringOpacity = ringAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.15, 0],
  });

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Animated Icon Section */}
      <View style={styles.iconSection}>
        {/* Pulsing ring */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.iconCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.clockFace}>
            <Ionicons name="time-outline" size={48} color="#1a1a2e" />
            {/* Animated clock overlay */}
            <Animated.View
              style={[
                styles.clockHand,
                { transform: [{ rotate: clockRotation }] },
              ]}
            />
          </View>
        </Animated.View>

        {/* Animated car */}
        <Animated.View
          style={[
            styles.carContainer,
            { transform: [{ translateX: carAnim }] },
          ]}
        >
          <Ionicons name="car-sport" size={22} color="#6c63ff" />
        </Animated.View>

        {/* Route dots */}
        <View style={styles.dotsRow}>
          {[dotAnim1, dotAnim2, dotAnim3].map((dot, index) => (
            <Animated.View
              key={index}
              style={[
                styles.routeDot,
                {
                  opacity: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1],
                  }),
                  transform: [
                    {
                      scale: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Text Content */}
      <Text style={styles.emptyTitle}>No Upcoming Rides</Text>
      <Text style={styles.emptySubtitle}>
        Whatever is on your schedule, a{'\n'}scheduled ride can get you there on time.
      </Text>

      {/* Learn More Link */}
      <TouchableOpacity style={styles.learnMore} onPress={onLearnMore} activeOpacity={0.7}>
        <Ionicons name="information-circle-outline" size={18} color="#6c63ff" />
        <Text style={styles.learnMoreText}>Learn how it works</Text>
        <Ionicons name="chevron-forward" size={16} color="#6c63ff" />
      </TouchableOpacity>

      {/* Schedule Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
        <TouchableOpacity style={styles.scheduleButton} onPress={onSchedule} activeOpacity={0.85}>
          <Ionicons name="calendar" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.scheduleButtonText}>Schedule a Ride</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const PastRideCard = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const isCancelled = item.status === 'Cancelled';

  return (
    <Animated.View
      style={[
        styles.rideCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.routeIconContainer}>
          <View style={[styles.routeIcon, isCancelled && styles.routeIconCancelled]}>
            <Ionicons
              name={isCancelled ? 'close-circle' : 'checkmark-circle'}
              size={20}
              color={isCancelled ? '#e74c3c' : '#27ae60'}
            />
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.route}>{item.route}</Text>
          <View style={styles.timeRow}>
            <Ionicons name="calendar-outline" size={13} color="#999" />
            <Text style={styles.time}>{item.date} • {item.time}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={[styles.statusBadge, isCancelled && styles.statusBadgeCancelled]}>
            <Text style={[styles.statusText, isCancelled && styles.statusTextCancelled]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('past');
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  const tabs = ['past', 'upcoming'];

  const switchTab = (tab) => {
    if (tab === activeTab) return;

    // Animate content fade out, switch, then fade in
    Animated.timing(contentFade, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    });

    // Animate indicator
    Animated.spring(indicatorAnim, {
      toValue: tab === 'past' ? 0 : 1,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const indicatorTranslate = indicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 48) / 2],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Rides</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={22} color="#1a1a2e" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{ translateX: indicatorTranslate }],
              width: (width - 48) / 2,
            },
          ]}
        />
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => switchTab(tab)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab === 'past' ? 'time-outline' : 'rocket-outline'}
              size={16}
              color={activeTab === tab ? '#fff' : '#666'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {tab === 'past' ? 'Past Rides' : 'Upcoming'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: contentFade }]}>
        {activeTab === 'upcoming' ? (
          <EmptyUpcoming
            onLearnMore={() => {}}
            onSchedule={() => {}}
          />
        ) : (
          <FlatList
            data={pastRides}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <PastRideCard item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              <View style={styles.footer}>
                <View style={styles.footerLine} />
                <Text style={styles.footerText}>
                  {pastRides.length} rides completed
                </Text>
                <View style={styles.footerLine} />
              </View>
            }
          />
        )}
      </Animated.View>

      {/* Floating Schedule Button (only on past tab) */}
      {activeTab === 'past' && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },

  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#e8e8ed',
    borderRadius: 14,
    padding: 4,
    position: 'relative',
  },

  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 11,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },

  activeTabText: {
    color: '#fff',
  },

  inactiveTabText: {
    color: '#666',
  },

  content: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },

  // Ride Card
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeIconContainer: {
    marginRight: 14,
  },

  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  routeIconCancelled: {
    backgroundColor: '#fde8e8',
  },

  cardInfo: {
    flex: 1,
  },

  route: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  time: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },

  priceContainer: {
    alignItems: 'flex-end',
  },

  price: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 4,
  },

  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  statusBadgeCancelled: {
    backgroundColor: '#fde8e8',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#27ae60',
    textTransform: 'uppercase',
  },

  statusTextCancelled: {
    color: '#e74c3c',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },

  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    height: 160,
  },

  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#6c63ff',
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0dbff',
  },

  clockFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  clockHand: {
    position: 'absolute',
    width: 2,
    height: 14,
    backgroundColor: '#6c63ff',
    top: 8,
    borderRadius: 1,
    transformOrigin: 'bottom',
  },

  carContainer: {
    position: 'absolute',
    bottom: 20,
  },

  dotsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    gap: 8,
  },

  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6c63ff',
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 12,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0eeff',
    borderRadius: 10,
    marginBottom: 32,
    gap: 6,
  },

  learnMoreText: {
    color: '#6c63ff',
    fontSize: 14,
    fontWeight: '600',
  },

  scheduleButton: {
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  scheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },

  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },

  footerText: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});