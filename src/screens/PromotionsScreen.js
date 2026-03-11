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
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const PROMOS = [
  {
    id: '1',
    code: 'ZENTERNEW',
    title: 'First Ride Free!',
    desc: 'Get your first ride completely free up to GHS 30',
    discount: '100%',
    expiry: 'Mar 30, 2026',
    gradient: ['#6c63ff', '#5a52d5'],
    icon: 'gift',
    active: true,
  },
  {
    id: '2',
    code: 'ZENTER50',
    title: '50% Off Next Ride',
    desc: 'Half price on your next ride anywhere in Accra',
    discount: '50%',
    expiry: 'Mar 15, 2026',
    gradient: ['#FF6B35', '#ff9a5c'],
    icon: 'pricetag',
    active: true,
  },
  {
    id: '3',
    code: 'FREEDEL',
    title: 'Free Food Delivery',
    desc: 'Free delivery on food orders above GHS 50',
    discount: 'Free',
    expiry: 'Mar 20, 2026',
    gradient: ['#00b894', '#55efc4'],
    icon: 'bicycle',
    active: true,
  },
  {
    id: '4',
    code: 'WEEKEND20',
    title: '20% Weekend Rides',
    desc: 'Save 20% on all weekend rides',
    discount: '20%',
    expiry: 'Expired',
    gradient: ['#636e72', '#b2bec3'],
    icon: 'calendar',
    active: false,
  },
];

const PromoCard = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 300 + index * 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.97, friction: 8, useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1, friction: 5, tension: 100, useNativeDriver: true,
          }).start();
        }}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.promoCard, !item.active && styles.promoCardExpired]}
        >
          <View style={styles.promoDecoCircle} />

          {!item.active && (
            <View style={styles.expiredOverlay}>
              <Text style={styles.expiredText}>EXPIRED</Text>
            </View>
          )}

          <View style={styles.promoTop}>
            <View style={styles.promoIconBg}>
              <Ionicons name={item.icon} size={22} color="#fff" />
            </View>
            <View style={styles.promoDiscountBadge}>
              <Text style={styles.promoDiscountText}>{item.discount}</Text>
            </View>
          </View>

          <Text style={styles.promoTitle}>{item.title}</Text>
          <Text style={styles.promoDesc}>{item.desc}</Text>

          <View style={styles.promoBottom}>
            <View style={styles.promoCodeContainer}>
              <Text style={styles.promoCode}>{item.code}</Text>
            </View>
            {item.active && (
              <TouchableOpacity
                style={[styles.promoCopyBtn, copied && styles.promoCopiedBtn]}
                activeOpacity={0.8}
                onPress={handleCopy}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color="#fff"
                />
                <Text style={styles.promoCopyText}>
                  {copied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.promoExpiry}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={styles.promoExpiryText}>
              {item.active ? `Expires ${item.expiry}` : item.expiry}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PromotionsScreen = ({ navigation }) => {
  const [promoInput, setPromoInput] = useState('');
  const headerFade = useRef(new Animated.Value(0)).current;
  const inputFade = useRef(new Animated.Value(0)).current;
  const inputSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(inputFade, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
        Animated.timing(inputSlide, {
          toValue: 0, duration: 400, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, []);

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
        <Text style={styles.headerTitle}>Promotions</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[styles.inputSection, { opacity: inputFade, transform: [{ translateY: inputSlide }] }]}
        >
          <View style={styles.inputCard}>
            <Ionicons name="pricetag" size={20} color="#6c63ff" />
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              placeholderTextColor="#bbb"
              value={promoInput}
              onChangeText={setPromoInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.applyBtn, !promoInput && styles.applyBtnDisabled]}
              activeOpacity={0.8}
              disabled={!promoInput}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Active Promotions</Text>
        {PROMOS.filter(p => p.active).map((item, index) => (
          <PromoCard key={item.id} item={item} index={index} />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Expired</Text>
        {PROMOS.filter(p => !p.active).map((item, index) => (
          <PromoCard key={item.id} item={item} index={index + 3} />
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
  inputSection: { marginBottom: 28 },
  inputCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 18, padding: 14, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06,
    shadowRadius: 8, elevation: 3,
  },
  promoInput: {
    flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a2e',
    marginLeft: 12, padding: 0, letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: '#6c63ff', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 12,
  },
  applyBtnDisabled: { backgroundColor: '#ddd' },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 16 },
  promoCard: {
    borderRadius: 24, padding: 22, marginBottom: 14, overflow: 'hidden',
  },
  promoCardExpired: { opacity: 0.6 },
  promoDecoCircle: {
    position: 'absolute', top: -30, right: -30, width: 120, height: 120,
    borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  expiredOverlay: {
    position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8,
  },
  expiredText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  promoTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  promoIconBg: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  promoDiscountBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: 10,
  },
  promoDiscountText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  promoTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
  promoDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 19, marginBottom: 16 },
  promoBottom: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  promoCodeContainer: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed',
  },
  promoCode: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 2 },
  promoCopyBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginLeft: 10,
  },
  promoCopiedBtn: { backgroundColor: 'rgba(0,200,100,0.4)' },
  promoCopyText: { color: '#fff', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  promoExpiry: { flexDirection: 'row', alignItems: 'center' },
  promoExpiryText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '500', marginLeft: 6 },
});

export default PromotionsScreen;