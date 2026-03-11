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

const ALL_TRANSACTIONS = [
  {
    id: '1',
    title: 'Ride to Airport',
    subtitle: 'East Legon → Kotoka',
    date: 'Mar 6, 2026',
    time: '2:30 PM',
    amount: '-GHS 18.00',
    type: 'debit',
    icon: 'car-sport',
    status: 'Completed',
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
    status: 'Completed',
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
    status: 'Completed',
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
    status: 'Completed',
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
    status: 'Completed',
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
    status: 'Completed',
  },
  {
    id: '7',
    title: 'Package Delivery',
    subtitle: 'Labadi →Tema',
    date: 'Feb 25, 2026',
    time: '2:00 PM',
    amount: '-GHS 35.00',
    type: 'debit',
    icon: 'cube',
    status: 'Completed',
  },
  {
    id: '8',
    title: 'Referral Bonus',
    subtitle: 'Friend signup reward',
    date: 'Feb 20, 2026',
    time: '10:00 AM',
    amount: '+GHS 10.00',
    type: 'credit',
    icon: 'person-add',
    status: 'Completed',
  },
];

const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity 
    style={[styles.filterChip, active && styles.filterChipActive]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function HistoryScreen() {
  const navigation = useNavigation();
  
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const [activeFilter, setActiveFilter] = React.useState('All');

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

  const handleTransactionPress = (item) => {
    navigation.navigate('TransactionDetails', { transaction: item });
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
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Ionicons name="options" size={22} color="#6c63ff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterChip label="All" active={activeFilter === 'All'} onPress={() => setActiveFilter('All')} />
          <FilterChip label="Rides" active={activeFilter === 'Rides'} onPress={() => setActiveFilter('Rides')} />
          <FilterChip label="Top-ups" active={activeFilter === 'Top-ups'} onPress={() => setActiveFilter('Top-ups')} />
          <FilterChip label="Send" active={activeFilter === 'Send'} onPress={() => setActiveFilter('Send')} />
          <FilterChip label="Cashback" active={activeFilter === 'Cashback'} onPress={() => setActiveFilter('Cashback')} />
        </ScrollView>
      </View>

      <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>-GHS 107.00</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Received</Text>
              <Text style={styles.summaryValueGreen}>+GHS 162.10</Text>
            </View>
          </View>

          {/* Transactions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Transactions</Text>
            {ALL_TRANSACTIONS.map((item) => {
              const isCredit = item.type === 'credit';
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.transactionItem}
                  onPress={() => handleTransactionPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.transactionIcon, { backgroundColor: isCredit ? '#e8f8f0' : '#f0eeff' }]}>
                    <Ionicons name={item.icon} size={22} color={isCredit ? '#00b894' : '#6c63ff'} />
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
                    <Text style={styles.transactionStatus}>{item.status}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: '#f8f8fc',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8e8ed',
  },
  filterChipActive: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e8e8ed',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  summaryValueGreen: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00b894',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  transactionSubtitle: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  transactionDate: {
    fontSize: 11,
    color: '#bbb',
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
  },
  creditAmount: {
    color: '#00b894',
  },
  debitAmount: {
    color: '#1a1a2e',
  },
  transactionStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00b894',
    marginTop: 4,
  },
});

