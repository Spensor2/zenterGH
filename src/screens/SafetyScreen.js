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

const EMERGENCY_CONTACTS = [
  { id: '1', name: 'Ama Asante', phone: '+233 24 XXX XXXX', relation: 'Sister' },
  { id: '2', name: 'Kofi Mensah', phone: '+233 20 XXX XXXX', relation: 'Friend' },
];

const SAFETY_FEATURES = [
  { id: '1', icon: 'location-outline', color: '#6c63ff', title: 'Share Trip', desc: 'Share live location with trusted contacts', toggle: true, defaultVal: true },
  { id: '2', icon: 'shield-checkmark-outline', color: '#00b894', title: 'Ride Verification', desc: 'Verify your driver before entering', toggle: true, defaultVal: true },
  { id: '3', icon: 'recording-outline', color: '#e74c3c', title: 'Audio Recording', desc: 'Record ride audio for safety', toggle: true, defaultVal: false },
  { id: '4', icon: 'navigate-outline', color: '#0984e3', title: 'Route Monitoring', desc: 'Alert when driver deviates from route', toggle: true, defaultVal: true },
];

const SafetyScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const sosScale = useRef(new Animated.Value(0)).current;
  const sosPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(contentSlide, {
          toValue: 0, duration: 500, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(sosScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sosPulse, {
          toValue: 1.08, duration: 1000, useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(sosPulse, {
          toValue: 1, duration: 1000, useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* SOS Button */}
        <Animated.View style={[styles.sosSection, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          <Animated.View style={{ transform: [{ scale: Animated.multiply(sosScale, sosPulse) }] }}>
            <TouchableOpacity activeOpacity={0.85}>
              <LinearGradient
                colors={['#e74c3c', '#c0392b']}
                style={styles.sosButton}
              >
                <View style={styles.sosRing} />
                <Ionicons name="warning" size={36} color="#fff" />
                <Text style={styles.sosText}>Emergency SOS</Text>
                <Text style={styles.sosSubtext}>Press and hold for 3 seconds</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Emergency Contacts */}
        <Animated.View style={{ opacity: contentFade }}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="add-circle" size={24} color="#6c63ff" />
            </TouchableOpacity>
          </View>
          {EMERGENCY_CONTACTS.map(contact => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitial}>{contact.name[0]}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone} • {contact.relation}</Text>
              </View>
              <TouchableOpacity style={styles.contactCallBtn} activeOpacity={0.7}>
                <Ionicons name="call" size={18} color="#00b894" />
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Safety Features */}
        <Animated.View style={{ opacity: contentFade }}>
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Safety Features</Text>
          <View style={styles.featuresGroup}>
            {SAFETY_FEATURES.map((feature, i) => (
              <React.Fragment key={feature.id}>
                <SafetyFeatureRow feature={feature} />
                {i < SAFETY_FEATURES.length - 1 && <View style={styles.featureDivider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Safety Tips */}
        <Animated.View style={[styles.tipsCard, { opacity: contentFade }]}>
          <View style={styles.tipsIconBg}>
            <Ionicons name="bulb" size={24} color="#f39c12" />
          </View>
          <Text style={styles.tipsTitle}>Safety Tips</Text>
          <Text style={styles.tipsText}>
            • Always verify your driver's photo and plate number{'\n'}
            • Share your trip with a trusted contact{'\n'}
            • Sit in the back seat when riding alone{'\n'}
            • Trust your instincts - cancel if uncomfortable
          </Text>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const SafetyFeatureRow = ({ feature }) => {
  const [enabled, setEnabled] = useState(feature.defaultVal);
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIconBg, { backgroundColor: feature.color + '15' }]}>
        <Ionicons name={feature.icon} size={20} color={feature.color} />
      </View>
      <View style={styles.featureInfo}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDesc}>{feature.desc}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={setEnabled}
        trackColor={{ false: '#e0e0e0', true: '#6c63ff' }}
        thumbColor="#fff"
      />
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
  sosSection: { alignItems: 'center', marginBottom: 32 },
  sosButton: {
    width: 180, height: 180, borderRadius: 90, alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden',
  },
  sosRing: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  sosText: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 8 },
  sosSubtext: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 },
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e' },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  contactAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#1a1a2e',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  contactInitial: { color: '#fff', fontSize: 18, fontWeight: '800' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  contactPhone: { fontSize: 12, color: '#999', marginTop: 2 },
  contactCallBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8f8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  featuresGroup: {
    backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  featureIconBg: {
    width: 42, height: 42, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginRight: 14,
  },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  featureDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  featureDivider: { height: 1, backgroundColor: '#f5f5fa', marginLeft: 72 },
  tipsCard: {
    backgroundColor: '#fff8e1', borderRadius: 20, padding: 20, marginTop: 28,
    borderWidth: 1, borderColor: '#ffe0b2',
  },
  tipsIconBg: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  tipsTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a2e', marginBottom: 10 },
  tipsText: { fontSize: 13, color: '#666', lineHeight: 22 },
});

export default SafetyScreen;