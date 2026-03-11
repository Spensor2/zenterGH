import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const menuSections = [
  {
    title: 'Account',
    items: [
      {
        id: '1',
        label: 'Edit Profile',
        icon: 'person-outline',
        color: '#6c63ff',
        desc: 'Name, phone, photo',
      },
      {
        id: '2',
        label: 'Saved Locations',
        icon: 'bookmark-outline',
        color: '#00b894',
        desc: 'Home, work, favorites',
      },
      {
        id: '3',
        label: 'Payment Methods',
        icon: 'card-outline',
        color: '#e17055',
        desc: 'Cards, mobile money',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: '4',
        label: 'Ride Preferences',
        icon: 'options-outline',
        color: '#0984e3',
        desc: 'Vehicle type, music, AC',
      },
      {
        id: '5',
        label: 'Notifications',
        icon: 'notifications-outline',
        color: '#fdcb6e',
        desc: 'Push, email, SMS',
        hasToggle: true,
      },
      {
        id: '6',
        label: 'Language',
        icon: 'globe-outline',
        color: '#a29bfe',
        desc: 'English',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: '7',
        label: 'Help & Support',
        icon: 'help-circle-outline',
        color: '#00cec9',
        desc: 'FAQ, live chat',
      },
      {
        id: '8',
        label: 'Safety',
        icon: 'shield-checkmark-outline',
        color: '#55efc4',
        desc: 'Emergency contacts, sharing',
      },
      {
        id: '9',
        label: 'About',
        icon: 'information-circle-outline',
        color: '#b2bec3',
        desc: 'Version 2.4.1',
      },
    ],
  },
];

const MenuItem = ({ item, index, sectionIndex, navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [notifEnabled, setNotifEnabled] = useState(true);

  const totalDelay = 300 + sectionIndex * 150 + index * 70;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay: totalDelay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        delay: totalDelay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    switch (item.id) {
      case '1': // Edit Profile
        navigation.navigate('EditProfile');
        break;
      case '2': // Saved Locations
        navigation.navigate('Location');
        break;
      case '3': // Payment Methods
        navigation.navigate('Cards');
        break;
      case '4': // Ride Preferences
        navigation.navigate('RideFilters');
        break;
      case '6': // Language
        navigation.navigate('Languages');
        break;
      case '7': // Help & Support
        navigation.navigate('HelpSupport');
        break;
      case '8': // Safety
        navigation.navigate('Safety');
        break;
      case '9': // About
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.menuItem}
        activeOpacity={0.8}
        onPress={item.hasToggle ? undefined : handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={[styles.menuIconBg, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Text style={styles.menuDesc}>{item.desc}</Text>
        </View>
        {item.hasToggle ? (
          <Switch
            value={notifEnabled}
            onValueChange={setNotifEnabled}
            trackColor={{ false: '#e0e0e0', true: '#6c63ff' }}
            thumbColor="#fff"
            ios_backgroundColor="#e0e0e0"
          />
        ) : (
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const SectionHeader = ({ title, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 250 + index * 150,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.sectionHeader, { opacity: fadeAnim }]}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </Animated.View>
  );
};

export default function AccountScreen() {
  const navigation = useNavigation();
  
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const profileFade = useRef(new Animated.Value(0)).current;
  const profileScale = useRef(new Animated.Value(0.85)).current;
  const avatarSpin = useRef(new Animated.Value(0)).current;
  const ringPulse = useRef(new Animated.Value(1)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const statsSlide = useRef(new Animated.Value(20)).current;
  const logoutFade = useRef(new Animated.Value(0)).current;
  const logoutSlide = useRef(new Animated.Value(20)).current;

  // Stats counter animations
  const ridesCount = useRef(new Animated.Value(0)).current;
  const ratingValue = useRef(new Animated.Value(0)).current;

  // Handle settings icon press
  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  // Handle edit profile icon press
  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  // Handle logout press
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  useEffect(() => {
    Animated.sequence([
      // Header
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Profile card
      Animated.parallel([
        Animated.timing(profileFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(profileScale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      // Stats
      Animated.parallel([
        Animated.timing(statsFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(statsSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();

    // Avatar ring pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, {
          toValue: 1.1,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(ringPulse, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Logout button
    Animated.parallel([
      Animated.timing(logoutFade, {
        toValue: 1,
        duration: 500,
        delay: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(logoutSlide, {
        toValue: 0,
        duration: 500,
        delay: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7} onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={22} color="#1a1a2e" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              opacity: profileFade,
              transform: [{ scale: profileScale }],
            },
          ]}
        >
          <View style={styles.profileTop}>
            <View style={styles.avatarSection}>
              <Animated.View
                style={[
                  styles.avatarRing,
                  { transform: [{ scale: ringPulse }] },
                ]}
              />
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>johndoe@email.com</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#6c63ff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.7} onPress={handleEditProfilePress}>
              <Ionicons name="pencil" size={14} color="#6c63ff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: statsFade,
              transform: [{ translateY: statsSlide }],
            },
          ]}
        >
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#f0eeff' }]}>
              <Ionicons name="car-sport" size={18} color="#6c63ff" />
            </View>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#fff8e1' }]}>
              <Ionicons name="star" size={18} color="#f39c12" />
            </View>
            <Text style={styles.statValue}>4.92</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#e8f8f0' }]}>
              <Ionicons name="calendar" size={18} color="#00b894" />
            </View>
            <Text style={styles.statValue}>2yr</Text>
            <Text style={styles.statLabel}>Member</Text>
          </View>
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.menuSection}>
            <SectionHeader title={section.title} index={sectionIndex} />
            <View style={styles.menuGroup}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={item.id}>
                  <MenuItem
                    item={item}
                    index={itemIndex}
                    sectionIndex={sectionIndex}
                    navigation={navigation}
                  />
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Animated.View
          style={[
            styles.logoutContainer,
            {
              opacity: logoutFade,
              transform: [{ translateY: logoutSlide }],
            },
          ]}
        >
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version Footer */}
        <Animated.View style={[styles.footer, { opacity: logoutFade }]}>
          <View style={styles.footerBrand}>
            <View style={styles.footerLogoDot1} />
            <View style={styles.footerLogoDot2} />
          </View>
          <Text style={styles.footerVersion}>RideApp v2.4.1</Text>
          <Text style={styles.footerCopy}>© 2026 RideApp. All rights reserved.</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },

  scrollContent: {
    paddingBottom: 50,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#f8f8fc',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },

  settingsBtn: {
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

  // Profile Card
  profileCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },

  avatarRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#6c63ff',
    opacity: 0.3,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00b894',
    borderWidth: 3,
    borderColor: '#fff',
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  profileEmail: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
    fontWeight: '500',
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f0eeff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },

  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6c63ff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  editAvatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },

  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f5',
    marginVertical: 8,
  },

  // Menu Sections
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },

  sectionHeader: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  menuGroup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  menuIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  menuContent: {
    flex: 1,
  },

  menuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  menuDesc: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
    fontWeight: '500',
  },

  menuDivider: {
    height: 1,
    backgroundColor: '#f5f5fa',
    marginLeft: 72,
  },

  // Logout
  logoutContainer: {
    marginHorizontal: 24,
    marginTop: 32,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#fde8e8',
    gap: 10,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e74c3c',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },

  footerBrand: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  footerLogoDot1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(108,99,255,0.3)',
  },

  footerLogoDot2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(108,99,255,0.15)',
    marginLeft: -8,
  },

  footerVersion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#bbb',
  },

  footerCopy: {
    fontSize: 11,
    color: '#ccc',
    fontWeight: '500',
  },
});