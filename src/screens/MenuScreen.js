import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MENU_ITEMS = [
  {
    section: 'Your Rides',
    items: [
      { id: '1', label: 'My Rides', icon: 'car-sport-outline', color: '#6c63ff', action: 'activity_all' },
      { id: '2', label: 'Scheduled Rides', icon: 'calendar-outline', color: '#9B59B6', action: 'activity_upcoming' },
      { id: '3', label: 'Ride History', icon: 'time-outline', color: '#0984e3', action: 'activity_past' },
    ],
  },
  {
    section: 'Services',
    items: [
      { id: '6', label: 'Reserve a Ride', icon: 'bookmark-outline', color: '#00b894', action: 'screen', screen: 'ReserveRide' },
    ],
  },
  {
    section: 'Account',
    items: [
      { id: '7', label: 'Wallet', icon: 'wallet-outline', color: '#27ae60', action: 'wallet_tab' },
      { id: '8', label: 'Promotions', icon: 'pricetag-outline', color: '#e17055', action: 'screen', screen: 'Promotions' },
      { id: '9', label: 'Settings', icon: 'settings-outline', color: '#636e72', action: 'screen', screen: 'Settings' },
    ],
  },
  {
    section: 'Support',
    items: [
      { id: '10', label: 'Help & Support', icon: 'help-circle-outline', color: '#00cec9', action: 'screen', screen: 'HelpSupport' },
      { id: '11', label: 'Safety', icon: 'shield-checkmark-outline', color: '#55efc4', action: 'screen', screen: 'Safety' },
      { id: '12', label: 'Rate Us', icon: 'star-outline', color: '#f39c12', action: 'screen', screen: 'RateUs' },
    ],
  },
];

const MenuItemRow = ({ item, index, sectionIndex, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = 150 + sectionIndex * 100 + index * 60;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 400, delay, useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 400, delay, useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }, { scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.menuRow}
        activeOpacity={0.7}
        onPress={onPress}
        onPressIn={() => {
          Animated.spring(scaleAnim, { toValue: 0.97, friction: 8, useNativeDriver: true }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }).start();
        }}
      >
        <View style={[styles.menuIconBg, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.menuLabel}>{item.label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#ddd" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const MenuScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const profileScale = useRef(new Animated.Value(0.9)).current;
  const profileFade = useRef(new Animated.Value(0)).current;
  const ringPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(profileScale, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.timing(profileFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, {
          toValue: 1.08, duration: 1500, useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(ringPulse, {
          toValue: 1, duration: 1500, useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  const handleItemPress = (item) => {
    switch (item.action) {
      case 'activity_all':
        navigation.navigate('MainTabs', { screen: 'Activity', params: { tab: 'past' } });
        break;

      case 'activity_upcoming':
        navigation.navigate('MainTabs', { screen: 'Activity', params: { tab: 'upcoming' } });
        break;

      case 'activity_past':
        navigation.navigate('MainTabs', { screen: 'Activity', params: { tab: 'past' } });
        break;

      case 'food_tab':
        navigation.navigate('MainTabs', { screen: 'Food' });
        break;

      case 'wallet_tab':
        navigation.navigate('Wallet');
        break;

      case 'screen':
        navigation.navigate(item.screen);
        break;

      default:
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }, 300);
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('MainTabs', { screen: 'Account' });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[styles.profileCard, { opacity: profileFade, transform: [{ scale: profileScale }] }]}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatarSection}>
              <Animated.View style={[styles.avatarRing, { transform: [{ scale: ringPulse }] }]} />
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>KA</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Kwame Asante</Text>
              <Text style={styles.profileEmail}>kwame@email.com</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#f39c12" />
                <Text style={styles.ratingText}>4.92</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileEditBtn} activeOpacity={0.7} onPress={handleEditProfile}>
              <Ionicons name="pencil" size={14} color="#6c63ff" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>GHS 120</Text>
              <Text style={styles.statLabel}>Wallet</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Promos</Text>
            </View>
          </View>
        </Animated.View>

        {MENU_ITEMS.map((section, sIdx) => (
          <View key={section.section} style={styles.menuSection}>
            <Animated.Text style={[styles.sectionTitle, { opacity: headerFade }]}>
              {section.section}
            </Animated.Text>
            <View style={styles.menuGroup}>
              {section.items.map((item, iIdx) => (
                <React.Fragment key={item.id}>
                  <MenuItemRow
                    item={item}
                    index={iIdx}
                    sectionIndex={sIdx}
                    onPress={() => handleItemPress(item)}
                  />
                  {iIdx < section.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 12,
  },
  closeBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  profileCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarSection: { marginRight: 14 },
  avatarRing: {
    position: 'absolute', top: -3, left: -3, width: 60, height: 60,
    borderRadius: 30, borderWidth: 2, borderColor: '#6c63ff', opacity: 0.3,
  },
  avatar: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: '#1a1a2e',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#00b894', borderWidth: 3, borderColor: '#fff',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  profileEmail: { fontSize: 13, color: '#999', marginTop: 2 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    alignSelf: 'flex-start', marginTop: 6,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#f39c12', marginLeft: 4 },
  profileEditBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0eeff',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#f8f8fc', borderRadius: 16, padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#aaa', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#e8e8ed', marginVertical: 4 },
  menuSection: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#aaa', textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4,
  },
  menuGroup: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIconBg: {
    width: 42, height: 42, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  menuDivider: { height: 1, backgroundColor: '#f5f5fa', marginLeft: 72 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 16, borderRadius: 16, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#fde8e8', marginTop: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#e74c3c', marginLeft: 10 },
});

export default MenuScreen;