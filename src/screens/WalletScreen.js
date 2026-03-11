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
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const transactions = [
  {
    id: '1',
    title: 'Ride to Airport',
    subtitle: 'East Legon → Kotoka',
    date: 'Mar 6, 2026',
    time: '2:30 PM',
    amount: '-GHS 18.00',
    type: 'debit',
    icon: 'car-sport',
  },
  {
    id: '2',
    title: 'Wallet Top-up',
    subtitle: 'MTN Mobile Money',
    date: 'Mar 5, 2026',
    time: '11:15 AM',
    amount: '+GHS 50.00',
    type: 'credit',
    icon: 'wallet',
  },
  {
    id: '3',
    title: 'Ride to Accra Mall',
    subtitle: 'Madina → Accra Mall',
    date: 'Mar 3, 2026',
    time: '4:00 PM',
    amount: '-GHS 42.00',
    type: 'debit',
    icon: 'car-sport',
  },
  {
    id: '4',
    title: 'Cashback Reward',
    subtitle: '5% ride cashback',
    date: 'Mar 3, 2026',
    time: '4:01 PM',
    amount: '+GHS 2.10',
    type: 'credit',
    icon: 'gift',
  },
  {
    id: '5',
    title: 'Ride to Osu',
    subtitle: 'Circle → Osu',
    date: 'Mar 1, 2026',
    time: '9:30 AM',
    amount: '-GHS 12.00',
    type: 'debit',
    icon: 'car-sport',
  },
  {
    id: '6',
    title: 'Wallet Top-up',
    subtitle: 'Visa •••• 4821',
    date: 'Feb 28, 2026',
    time: '8:00 AM',
    amount: '+GHS 100.00',
    type: 'credit',
    icon: 'card',
  },
];

const quickActions = [
  { id: '1', label: 'Add Money', icon: 'add-circle', color: '#000000' },
  { id: '2', label: 'Send', icon: 'paper-plane', color: '#333333' },
  { id: '3', label: 'Cards', icon: 'card', color: '#000000' },
  { id: '4', label: 'History', icon: 'receipt', color: '#000000' },
];

const TransactionItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay: 400 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        delay: 400 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  const isCredit = item.type === 'credit';

  return (
    <Animated.View
      style={[
        styles.transactionCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity style={styles.transactionInner} activeOpacity={0.6}>
        <View style={[styles.transactionIcon, { backgroundColor: isCredit ? '#e8f8f0' : '#f0eeff' }]}>
          <Ionicons
            name={item.icon}
            size={20}
            color={isCredit ? '#00b894' : '#6c63ff'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
          <View style={styles.transactionMeta}>
            <Ionicons name="time-outline" size={11} color="#bbb" />
            <Text style={styles.transactionDate}>{item.date} • {item.time}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, isCredit ? styles.creditAmount : styles.debitAmount]}>
            {item.amount}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#ddd" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function WalletScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigation = useNavigation();

  // Safe navigation that works from nested navigators
  const goTo = (screenName) => {
    try {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate(screenName);
      } else {
        navigation.navigate(screenName);
      }
    } catch (error) {
      try {
        navigation.navigate(screenName);
      } catch (e) {
        console.warn('Navigation failed for:', screenName);
      }
    }
  };

  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const actionsFade = useRef(new Animated.Value(0)).current;
  const actionsSlide = useRef(new Animated.Value(20)).current;
  const sectionFade = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const balanceFade = useRef(new Animated.Value(1)).current;

  // Individual action button animations
  const actionAnims = quickActions.map(() => ({
    scale: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      // Header fade in
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // Card entrance
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // Quick actions
      Animated.parallel([
        Animated.timing(actionsFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionsSlide, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        // Staggered action buttons
        Animated.stagger(
          80,
          actionAnims.map((anim) =>
            Animated.spring(anim.scale, {
              toValue: 1,
              friction: 6,
              tension: 100,
              useNativeDriver: true,
            })
          )
        ),
      ]),
      // Section title
      Animated.timing(sectionFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Card shimmer loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  const toggleBalance = () => {
    Animated.sequence([
      Animated.timing(balanceFade, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setBalanceVisible(!balanceVisible);
      Animated.spring(balanceFade, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View>
          <Text style={styles.greeting}>My Wallet</Text>
          <Text style={styles.subtitle}>Manage your funds</Text>
        </View>
        <TouchableOpacity 
          style={styles.notifButton} 
          activeOpacity={0.8}
          onPress={() => goTo('Notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color="#1a1a2e" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Card */}
        <Animated.View
          style={[
            styles.balanceCard,
            {
              opacity: cardFade,
              transform: [{ scale: cardScale }, { translateY: cardSlide }],
            },
          ]}
        >
          {/* Shimmer overlay */}
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX: shimmerTranslate }] },
            ]}
          />

          {/* Decorative circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          <View style={styles.cardTop}>
            <View style={styles.cardBrand}>
              <View style={styles.brandDot1} />
              <View style={styles.brandDot2} />
            </View>
            <TouchableOpacity onPress={toggleBalance} activeOpacity={0.7}>
              <Ionicons
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Animated.View style={{ opacity: balanceFade }}>
            <Text style={styles.balance}>
              {balanceVisible ? 'GHS 120.00' : '••••••'}
            </Text>
          </Animated.View>

          <View style={styles.cardBottom}>
            <View style={styles.cardDetail}>
              <Text style={styles.cardDetailLabel}>This Month</Text>
              <Text style={styles.cardDetailValue}>-GHS 72.00</Text>
            </View>
            <View style={styles.cardDetail}>
              <Text style={styles.cardDetailLabel}>Top-ups</Text>
              <Text style={styles.cardDetailValueGreen}>+GHS 150.00</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.actionsSection,
            {
              opacity: actionsFade,
              transform: [{ translateY: actionsSlide }],
            },
          ]}
        >
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                style={[
                  styles.actionWrapper,
                  { transform: [{ scale: actionAnims[index].scale }] },
                ]}
              >
                <TouchableOpacity 
                  style={styles.actionButton} 
                  activeOpacity={0.7}
                  onPress={() => {
                    if (action.label === 'Add Money') navigation.navigate('AddMoney');
                    else if (action.label === 'Send') navigation.navigate('Send');
                    else if (action.label === 'Cards') navigation.navigate('Cards');
                    else if (action.label === 'History') navigation.navigate('History');
                  }}
                >
                  <View style={[styles.actionIconBg, { backgroundColor: `${action.color}15` }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity> REPLACE
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Promo Banner */}
        <Animated.View style={[styles.promoBanner, { opacity: sectionFade }]}>
          <TouchableOpacity style={styles.promoInner} activeOpacity={0.8}>
            <View style={styles.promoContent}>
              <View style={styles.promoIconBg}>
                <Ionicons name="gift" size={20} color="#6c63ff" />
              </View>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoTitle}>Top up GHS 100+</Text>
                <Text style={styles.promoSubtitle}>Get 5% cashback on your next ride</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6c63ff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Transactions Section */}
        <Animated.View style={[styles.sectionHeader, { opacity: sectionFade }]}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </Animated.View>

        {transactions.map((item, index) => (
          <TransactionItem key={item.id} item={item} index={index} />
        ))}

        <Animated.View style={[styles.listFooter, { opacity: sectionFade }]}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>You're all caught up</Text>
          <View style={styles.footerLine} />
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
    paddingBottom: 40,
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

  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    fontWeight: '500',
  },

  notifButton: {
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

  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Balance Card
  balanceCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ skewX: '-20deg' }],
  },

  decoCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(108,99,255,0.15)',
  },

  decoCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(108,99,255,0.08)',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  cardBrand: {
    flexDirection: 'row',
    gap: -8,
  },

  brandDot1: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(108,99,255,0.6)',
  },

  brandDot2: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(108,99,255,0.3)',
    marginLeft: -10,
  },

  balanceLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  balance: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },

  cardDetail: {
    gap: 4,
  },

  cardDetailLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cardDetailValue: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '700',
  },

  cardDetailValueGreen: {
    color: '#00d2a0',
    fontSize: 16,
    fontWeight: '700',
  },

  // Quick Actions
  actionsSection: {
    marginTop: 28,
    paddingHorizontal: 24,
  },

  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  actionButton: {
    alignItems: 'center',
    gap: 10,
  },

  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0eeff',
  },

  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 24,
    marginTop: 24,
  },

  promoInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0eeff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0dbff',
  },

  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  promoIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  promoTextContainer: {
    flex: 1,
  },

  promoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  promoSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
  },

  // Transactions
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c63ff',
  },

  transactionCard: {
    marginHorizontal: 24,
    marginBottom: 10,
  },

  transactionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  transactionSubtitle: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
    fontWeight: '500',
  },

  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },

  transactionDate: {
    fontSize: 11,
    color: '#bbb',
    fontWeight: '500',
  },

  amountContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },

  amount: {
    fontSize: 15,
    fontWeight: '800',
  },

  creditAmount: {
    color: '#00b894',
  },

  debitAmount: {
    color: '#1a1a2e',
  },

  // Footer
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },

  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e8ed',
  },

  footerText: {
    fontSize: 12,
    color: '#bbb',
    fontWeight: '600',
  },
});