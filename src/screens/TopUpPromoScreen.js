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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TOP_UP_PACKAGES = [
  { id: '1', amount: 100, bonus: 5, popular: true },
  { id: '2', amount: 200, bonus: 12 },
  { id: '3', amount: 300, bonus: 20 },
  { id: '4', amount: 500, bonus: 35 },
  { id: '5', amount: 1000, bonus: 75 },
];

export default function TopUpPromoScreen() {
  const navigation = useNavigation();
  
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const handlePackageSelect = (pkg) => {
    navigation.navigate('AddMoney', { amount: pkg.amount });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Up & Save</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Ionicons name="gift" size={32} color="#6c63ff" />
              </View>
              <Text style={styles.heroTitle}>Get 5% Cashback!</Text>
              <Text style={styles.heroSubtitle}>
                Top up GHS 100 or more and get extra 5% cashback on your next ride
              </Text>
            </View>
            <View style={styles.heroDecor1} />
            <View style={styles.heroDecor2} />
          </View>

          {/* How it Works */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How it works</Text>
            <View style={styles.stepsContainer}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Top Up</Text>
                  <Text style={styles.stepSubtitle}>Add GHS 100 or more</Text>
                </View>
              </View>
              <View style={styles.stepConnector} />
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Get Bonus</Text>
                  <Text style={styles.stepSubtitle}>Receive 5% extra</Text>
                </View>
              </View>
              <View style={styles.stepConnector} />
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Enjoy Ride</Text>
                  <Text style={styles.stepSubtitle}>Use on your next trip</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Top Up Packages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Amount</Text>
            {TOP_UP_PACKAGES.map((pkg) => (
              <TouchableOpacity 
                key={pkg.id} 
                style={[styles.packageCard, pkg.popular && styles.packageCardPopular]}
                onPress={() => handlePackageSelect(pkg)}
                activeOpacity={0.7}
              >
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}
                <View style={styles.packageLeft}>
                  <Text style={styles.packageAmount}>GHS {pkg.amount}</Text>
                  <Text style={styles.packageBonus}>+GHS {pkg.bonus} Bonus</Text>
                </View>
                <View style={styles.packageRight}>
                  <Text style={styles.packageButton}>Top Up</Text>
                  <Ionicons name="chevron-forward" size={18} color="#6c63ff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Terms */}
          <View style={styles.termsCard}>
            <Ionicons name="information-circle" size={20} color="#999" />
            <Text style={styles.termsText}>
              Cashback will be credited to your wallet within 24 hours. Valid for one use per user. 
              Minimum top-up of GHS 100 required.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#f8f8fc',
  },
  backButton: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroCard: {
    backgroundColor: '#6c63ff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  heroDecor1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  stepsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  stepConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#f0eeff',
    marginLeft: 15,
    marginVertical: 8,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e8e8ed',
  },
  packageCardPopular: {
    borderColor: '#6c63ff',
    backgroundColor: '#fcfcff',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#6c63ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  packageLeft: {
    flex: 1,
  },
  packageAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  packageBonus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00b894',
    marginTop: 4,
  },
  packageRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6c63ff',
    marginRight: 4,
  },
  termsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    marginLeft: 10,
  },
});

