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

const SETTINGS = [
  {
    section: 'Notifications',
    items: [
      { id: '1', label: 'Push Notifications', icon: 'notifications-outline', color: '#6c63ff', toggle: true, defaultVal: true },
      { id: '2', label: 'Email Updates', icon: 'mail-outline', color: '#0984e3', toggle: true, defaultVal: true },
      { id: '3', label: 'SMS Alerts', icon: 'chatbubble-outline', color: '#00b894', toggle: true, defaultVal: false },
      { id: '4', label: 'Promo Notifications', icon: 'pricetag-outline', color: '#e17055', toggle: true, defaultVal: true },
    ],
  },
  {
    section: 'Ride Preferences',
    items: [
      { id: '5', label: 'Preferred Vehicle', icon: 'car-sport-outline', color: '#6c63ff', value: 'Comfort' },
      { id: '6', label: 'Music in Ride', icon: 'musical-notes-outline', color: '#e17055', toggle: true, defaultVal: true },
      { id: '7', label: 'AC Always On', icon: 'snow-outline', color: '#0984e3', toggle: true, defaultVal: true },
      { id: '8', label: 'Quiet Ride', icon: 'volume-mute-outline', color: '#636e72', toggle: true, defaultVal: false },
    ],
  },
  {
    section: 'Privacy & Security',
    items: [
      { id: '9', label: 'Face ID / Fingerprint', icon: 'finger-print-outline', color: '#00b894', toggle: true, defaultVal: false },
      { id: '10', label: 'Share Live Location', icon: 'location-outline', color: '#e74c3c', toggle: true, defaultVal: true },
      { id: '11', label: 'Data & Privacy', icon: 'shield-outline', color: '#9B59B6', value: '' },
      { id: '12', label: 'Delete Account', icon: 'trash-outline', color: '#e74c3c', value: '', danger: true },
    ],
  },
  {
    section: 'App',
    items: [
      { id: '13', label: 'Language', icon: 'globe-outline', color: '#a29bfe', value: 'English' },
      { id: '14', label: 'Dark Mode', icon: 'moon-outline', color: '#1a1a2e', toggle: true, defaultVal: false },
      { id: '15', label: 'App Version', icon: 'information-circle-outline', color: '#636e72', value: 'v2.4.1' },
    ],
  },
];

const SettingItem = ({ item, index, sectionIndex }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const [toggled, setToggled] = useState(item.defaultVal || false);

  useEffect(() => {
    const delay = 200 + sectionIndex * 100 + index * 50;
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
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={[styles.settingRow, item.danger && styles.settingRowDanger]}>
        <View style={[styles.settingIconBg, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={[styles.settingLabel, item.danger && styles.settingLabelDanger]}>
          {item.label}
        </Text>
        {item.toggle ? (
          <Switch
            value={toggled}
            onValueChange={setToggled}
            trackColor={{ false: '#e0e0e0', true: '#6c63ff' }}
            thumbColor="#fff"
          />
        ) : item.value !== undefined ? (
          <View style={styles.settingValueRow}>
            {item.value ? <Text style={styles.settingValue}>{item.value}</Text> : null}
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
};

const SettingsScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {SETTINGS.map((section, sIdx) => (
          <View key={section.section} style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.settingGroup}>
              {section.items.map((item, iIdx) => (
                <React.Fragment key={item.id}>
                  <SettingItem item={item} index={iIdx} sectionIndex={sIdx} />
                  {iIdx < section.items.length - 1 && <View style={styles.settingDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
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
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  settingSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#aaa', textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 10, paddingHorizontal: 4,
  },
  settingGroup: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingRowDanger: {},
  settingIconBg: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', marginRight: 14,
  },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  settingLabelDanger: { color: '#e74c3c' },
  settingValueRow: { flexDirection: 'row', alignItems: 'center' },
  settingValue: { fontSize: 14, color: '#999', fontWeight: '500', marginRight: 8 },
  settingDivider: { height: 1, backgroundColor: '#f5f5fa', marginLeft: 70 },
});

export default SettingsScreen;