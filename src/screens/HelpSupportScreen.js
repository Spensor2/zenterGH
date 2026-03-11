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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HELP_TOPICS = [
  { id: '1', icon: 'car-sport-outline', color: '#6c63ff', title: 'Ride Issues', desc: 'Problems with rides, drivers, or routes' },
  { id: '2', icon: 'card-outline', color: '#00b894', title: 'Payment & Billing', desc: 'Charges, refunds, and wallet issues' },
  { id: '3', icon: 'person-outline', color: '#e17055', title: 'Account Issues', desc: 'Login, profile, and verification' },
  { id: '4', icon: 'shield-outline', color: '#0984e3', title: 'Safety Concerns', desc: 'Report incidents or safety issues' },
  { id: '5', icon: 'cube-outline', color: '#9B59B6', title: 'Package Delivery', desc: 'Lost, damaged, or delayed packages' },
  { id: '6', icon: 'fast-food-outline', color: '#FF6B35', title: 'Food Orders', desc: 'Wrong orders, missing items' },
];

const FAQS = [
  { id: '1', q: 'How do I cancel a ride?', a: 'Tap on your active ride, then press "Cancel Ride". Free cancellation within 2 minutes of booking.' },
  { id: '2', q: 'How do I get a refund?', a: 'Go to Ride History, select the ride, and tap "Request Refund". Refunds are processed within 3-5 business days.' },
  { id: '3', q: 'How to add a payment method?', a: 'Go to Account > Payment Methods > Add New. We support Mobile Money, Visa, and Mastercard.' },
  { id: '4', q: 'Can I share my ride location?', a: 'Yes! During an active ride, tap "Share Trip" to send your live location to contacts.' },
];

const FAQItem = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 400, delay: 500 + index * 80,
        useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 400, delay: 500 + index * 80,
        useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={[styles.faqCard, expanded && styles.faqCardExpanded]}
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQ}>{item.q}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#6c63ff" />
        </View>
        {expanded && <Text style={styles.faqA}>{item.a}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const HelpSupportScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  const topicAnims = HELP_TOPICS.map(() => ({
    scale: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(contentSlide, {
          toValue: 0, duration: 400, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.stagger(60,
          topicAnims.map(a =>
            Animated.spring(a.scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true })
          )
        ),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <Animated.View style={[styles.searchCard, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor="#bbb"
          />
        </Animated.View>

        {/* Live Chat Banner */}
        <Animated.View style={{ opacity: contentFade }}>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={['#6c63ff', '#5a52d5']}
              style={styles.chatBanner}
            >
              <View style={styles.chatBannerContent}>
                <View style={styles.chatIconBg}>
                  <Ionicons name="chatbubbles" size={24} color="#6c63ff" />
                </View>
                <View style={styles.chatTextSection}>
                  <Text style={styles.chatTitle}>Live Chat Support</Text>
                  <Text style={styles.chatDesc}>Chat with us now • Usually replies in 2 min</Text>
                </View>
              </View>
              <View style={styles.chatOnlineDot} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Topics */}
        <Text style={styles.sectionTitle}>Help Topics</Text>
        <View style={styles.topicsGrid}>
          {HELP_TOPICS.map((topic, i) => (
            <Animated.View
              key={topic.id}
              style={[styles.topicWrapper, { transform: [{ scale: topicAnims[i].scale }] }]}
            >
              <TouchableOpacity style={styles.topicCard} activeOpacity={0.7}>
                <View style={[styles.topicIconBg, { backgroundColor: topic.color + '15' }]}>
                  <Ionicons name={topic.icon} size={24} color={topic.color} />
                </View>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc} numberOfLines={2}>{topic.desc}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Frequently Asked</Text>
        {FAQS.map((faq, i) => (
          <FAQItem key={faq.id} item={faq} index={i} />
        ))}

        {/* Contact Options */}
        <Animated.View style={[styles.contactSection, { opacity: contentFade }]}>
          <Text style={styles.sectionTitle}>Other Ways to Reach Us</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} activeOpacity={0.7}>
              <Ionicons name="call" size={22} color="#00b894" />
              <Text style={styles.contactLabel}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} activeOpacity={0.7}>
              <Ionicons name="mail" size={22} color="#0984e3" />
              <Text style={styles.contactLabel}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} activeOpacity={0.7}>
              <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
              <Text style={styles.contactLabel}>Twitter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

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
  searchCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1a1a2e', marginLeft: 12, padding: 0 },
  chatBanner: { borderRadius: 20, padding: 20, marginBottom: 28, flexDirection: 'row', alignItems: 'center' },
  chatBannerContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  chatIconBg: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  chatTextSection: { flex: 1 },
  chatTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  chatDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  chatOnlineDot: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#00E676',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 16 },
  topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 28, marginHorizontal: -5 },
  topicWrapper: { width: '50%', paddingHorizontal: 5, marginBottom: 10 },
  topicCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  topicIconBg: {
    width: 46, height: 46, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  topicTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  topicDesc: { fontSize: 11, color: '#999', lineHeight: 16 },
  faqCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  faqCardExpanded: { borderWidth: 1.5, borderColor: '#6c63ff20' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 10 },
  faqA: {
    fontSize: 13, color: '#888', lineHeight: 20, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5f5fa',
  },
  contactSection: { marginTop: 12 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between' },
  contactBtn: {
    flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 18,
    padding: 20, marginHorizontal: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  contactLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginTop: 8 },
});

export default HelpSupportScreen;