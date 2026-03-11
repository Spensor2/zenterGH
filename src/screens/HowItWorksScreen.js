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
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    id: '1',
    icon: 'calendar-outline',
    color: '#6c63ff',
    title: 'Pick a Date & Time',
    desc: 'Choose when you want to be picked up. Schedule rides up to 7 days ahead.',
  },
  {
    id: '2',
    icon: 'location-outline',
    color: '#00b894',
    title: 'Set Your Route',
    desc: 'Enter your pickup and dropoff locations. Save frequent routes for quick booking.',
  },
  {
    id: '3',
    icon: 'car-sport-outline',
    color: '#FF6B35',
    title: 'Choose Your Ride',
    desc: 'Select from Standard, Comfort, Premium, or XL based on your needs.',
  },
  {
    id: '4',
    icon: 'checkmark-circle-outline',
    color: '#0984e3',
    title: 'Confirm & Relax',
    desc: 'Your driver will be assigned and arrive on time. Track in real-time.',
  },
];

const FAQS = [
  {
    id: '1',
    q: 'Can I cancel a scheduled ride?',
    a: 'Yes, you can cancel up to 30 minutes before the scheduled time for free.',
  },
  {
    id: '2',
    q: 'What if my driver is late?',
    a: 'We guarantee on-time arrival. If late, you get 20% off your next ride.',
  },
  {
    id: '3',
    q: 'Can I schedule recurring rides?',
    a: 'Yes! Set daily or weekly recurring schedules for your regular commutes.',
  },
  {
    id: '4',
    q: 'How far in advance can I book?',
    a: 'You can schedule rides up to 7 days in advance.',
  },
];

const StepCard = ({ item, index, total }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 400 + index * 150;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.stepCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.stepLeft}>
        <Animated.View
          style={[
            styles.stepIconBg,
            { backgroundColor: item.color + '15', transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Ionicons name={item.icon} size={28} color={item.color} />
        </Animated.View>
        {index < total - 1 && <View style={[styles.stepLine, { backgroundColor: item.color + '30' }]} />}
      </View>
      <View style={styles.stepContent}>
        <View style={styles.stepBadge}>
          <Text style={[styles.stepNumber, { color: item.color }]}>Step {index + 1}</Text>
        </View>
        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepDesc}>{item.desc}</Text>
      </View>
    </Animated.View>
  );
};

const FAQItem = ({ item, index }) => {
  const [expanded, setExpanded] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 800 + index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 800 + index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.spring(heightAnim, {
      toValue: expanded ? 0 : 1,
      friction: 8,
      tension: 80,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.faqCard, expanded && styles.faqCardExpanded]}
        activeOpacity={0.8}
        onPress={toggleExpand}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{item.q}</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#6c63ff"
          />
        </View>
        {expanded && (
          <Text style={styles.faqAnswer}>{item.a}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const HowItWorksScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(heroFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heroSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();

    // Delayed button entrance
    setTimeout(() => {
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }, 1500);

    // Rotating icon loop
    Animated.loop(
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How It Works</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroCard,
            { opacity: heroFade, transform: [{ translateY: heroSlide }] },
          ]}
        >
          <LinearGradient
            colors={['#6c63ff', '#5a52d5']}
            style={styles.heroGradient}
          >
            <View style={styles.heroDecoCircle1} />
            <View style={styles.heroDecoCircle2} />

            <Animated.View style={[styles.heroIconBg, { transform: [{ rotate: spin }] }]}>
              <Ionicons name="time" size={40} color="#fff" />
            </Animated.View>
            <Text style={styles.heroTitle}>Schedule Your Rides</Text>
            <Text style={styles.heroDesc}>
              Never worry about finding a ride again.{'\n'}
              Plan ahead and we'll handle the rest.
            </Text>

            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>98%</Text>
                <Text style={styles.heroStatLabel}>On-Time</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>7 Days</Text>
                <Text style={styles.heroStatLabel}>Advance</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>24/7</Text>
                <Text style={styles.heroStatLabel}>Available</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>Simple Steps</Text>
        {STEPS.map((step, index) => (
          <StepCard key={step.id} item={step} index={index} total={STEPS.length} />
        ))}

        {/* FAQ */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
          Frequently Asked Questions
        </Text>
        {FAQS.map((faq, index) => (
          <FAQItem key={faq.id} item={faq} index={index} />
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA Button */}
      <Animated.View
        style={[styles.ctaContainer, { transform: [{ scale: buttonScale }] }]}
      >
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.85}
          onPress={() => {
            navigation.goBack();
            setTimeout(() => {
              navigation.navigate('ReserveRide');
            }, 300);
          }}
        >
          <LinearGradient
            colors={['#6c63ff', '#5a52d5']}
            style={styles.ctaGradient}
          >
            <Ionicons name="calendar" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.ctaText}>Schedule Your First Ride</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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

  // Hero
  heroCard: { marginBottom: 32, borderRadius: 24, overflow: 'hidden' },

  heroGradient: {
    padding: 28, alignItems: 'center', borderRadius: 24, overflow: 'hidden',
  },

  heroDecoCircle1: {
    position: 'absolute', top: -40, right: -40,
    width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)',
  },

  heroDecoCircle2: {
    position: 'absolute', bottom: -20, left: -20,
    width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)',
  },

  heroIconBg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },

  heroTitle: {
    fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 10, textAlign: 'center',
  },

  heroDesc: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },

  heroStats: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16, padding: 16, width: '100%',
  },

  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 20, fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: 4 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 4 },

  // Section
  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 20,
  },

  // Steps
  stepCard: {
    flexDirection: 'row', marginBottom: 8,
  },

  stepLeft: { alignItems: 'center', marginRight: 16 },

  stepIconBg: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },

  stepLine: {
    width: 2, flex: 1, marginTop: 8, borderRadius: 1,
  },

  stepContent: { flex: 1, paddingBottom: 24 },

  stepBadge: { marginBottom: 6 },

  stepNumber: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1,
  },

  stepTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  stepDesc: { fontSize: 14, color: '#888', lineHeight: 21 },

  // FAQ
  faqCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },

  faqCardExpanded: {
    borderWidth: 1.5, borderColor: '#6c63ff20',
  },

  faqHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },

  faqQuestion: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 10 },

  faqAnswer: {
    fontSize: 14, color: '#888', lineHeight: 21, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5f5fa',
  },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20, right: 20,
  },

  ctaBtn: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#6c63ff', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },

  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 18,
  },

  ctaText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});

export default HowItWorksScreen;