import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'ride',
    title: 'Ride Completed',
    message: 'Your ride to Accra Mall has been completed. Rate your driver!',
    time: '2 min ago',
    icon: 'car-sport',
    color: '#6c63ff',
    unread: true,
  },
  {
    id: '2',
    type: 'promo',
    title: '50% Off Your Next Ride! 🎉',
    message: 'Use code ZENTER50 before midnight. Limited time offer!',
    time: '15 min ago',
    icon: 'gift',
    color: '#FF6B35',
    unread: true,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Successful',
    message: 'GHS 50.00 has been added to your wallet via MTN Mobile Money.',
    time: '1 hour ago',
    icon: 'wallet',
    color: '#00b894',
    unread: true,
  },
  {
    id: '4',
    type: 'ride',
    title: 'Driver Arriving',
    message: 'Your driver Kofi is 3 minutes away. Toyota Corolla - GR 4521.',
    time: '2 hours ago',
    icon: 'navigate',
    color: '#0984e3',
    unread: false,
  },
  {
    id: '5',
    type: 'system',
    title: 'Account Verified ✓',
    message: 'Your phone number has been successfully verified.',
    time: 'Yesterday',
    icon: 'shield-checkmark',
    color: '#00cec9',
    unread: false,
  },
  {
    id: '6',
    type: 'food',
    title: 'Order Delivered',
    message: 'Your food order from Papaye has been delivered. Enjoy!',
    time: 'Yesterday',
    icon: 'fast-food',
    color: '#e17055',
    unread: false,
  },
  {
    id: '7',
    type: 'promo',
    title: 'Weekend Special',
    message: 'Free delivery on all food orders this weekend!',
    time: '2 days ago',
    icon: 'pricetag',
    color: '#a29bfe',
    unread: false,
  },
];

const NotifItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay: 200 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        delay: 200 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.notifCard, item.unread && styles.notifCardUnread]}
        activeOpacity={0.7}
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.97,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();
        }}
      >
        <View style={[styles.notifIconBg, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon} size={22} color={item.color} />
        </View>
        <View style={styles.notifContent}>
          <View style={styles.notifHeader}>
            <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
            {item.unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.markAllBtn} activeOpacity={0.7}>
          <Ionicons name="checkmark-done" size={22} color="#6c63ff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {NOTIFICATIONS.map((item, index) => (
          <NotifItem key={item.id} item={item} index={index} />
        ))}

        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>All caught up</Text>
          <View style={styles.footerLine} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 16,
    backgroundColor: '#f8f8fc',
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  headerCenter: { flexDirection: 'row', alignItems: 'center' },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  badge: {
    backgroundColor: '#e74c3c',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  markAllBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: '#6c63ff',
  },

  notifIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  notifContent: { flex: 1 },

  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6c63ff',
    marginLeft: 8,
  },

  notifMessage: {
    fontSize: 13,
    color: '#888',
    lineHeight: 19,
    marginBottom: 6,
  },

  notifTime: {
    fontSize: 11,
    color: '#bbb',
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },

  footerLine: { flex: 1, height: 1, backgroundColor: '#e8e8ed' },
  footerText: { fontSize: 12, color: '#bbb', fontWeight: '600', marginHorizontal: 12 },
});

export default NotificationsScreen;