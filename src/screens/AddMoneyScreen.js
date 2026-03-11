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

const PAYMENT_METHODS = [
  { id: '1', label: 'MTN Mobile Money', icon: 'phone-portrait', color: '#ffcb00' },
  { id: '2', label: 'Vodafone Cash', icon: 'call', color: '#e60000' },
  { id: '3', label: 'AirtelTigo Money', icon: 'wallet', color: '#ff0066' },
  { id: '4', label: 'Bank Transfer', icon: 'business', color: '#6c63ff' },
  { id: '5', label: 'Visa / Mastercard', icon: 'card', color: '#1a1a2e' },
];

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

export default function AddMoneyScreen() {
  const navigation = useNavigation();
  
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const [selectedAmount, setSelectedAmount] = React.useState(null);
  const [customAmount, setCustomAmount] = React.useState('');

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
        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Amount Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Amount</Text>
            <View style={styles.quickAmounts}>
              {QUICK_AMOUNTS.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountChip,
                    selectedAmount === amount && styles.amountChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.amountText,
                    selectedAmount === amount && styles.amountTextSelected,
                  ]}>
                    GHS {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR ENTER CUSTOM AMOUNT</Text>
              <View style={styles.orLine} />
            </View>

            <View style={styles.customAmountContainer}>
              <Text style={styles.currencySymbol}>GHS</Text>
              <TouchableOpacity style={styles.customAmountInput} activeOpacity={0.7}>
                <Text style={styles.customAmountText}>
                  {customAmount || '0.00'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {PAYMENT_METHODS.map((method, index) => (
              <TouchableOpacity 
                key={method.id} 
                style={styles.paymentMethod}
                activeOpacity={0.7}
              >
                <View style={[styles.paymentIcon, { backgroundColor: method.color + '15' }]}>
                  <Ionicons name={method.icon} size={22} color={method.color} />
                </View>
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ddd" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Money Button */}
          <TouchableOpacity style={styles.addMoneyButton} activeOpacity={0.8}>
            <Text style={styles.addMoneyButtonText}>Add GHS {(selectedAmount || customAmount || 0).toString()}</Text>
          </TouchableOpacity>

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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountChip: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e8e8ed',
  },
  amountChipSelected: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  amountTextSelected: {
    color: '#fff',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e8ed',
  },
  orText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    marginHorizontal: 12,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#6c63ff',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6c63ff',
    marginRight: 12,
  },
  customAmountInput: {
    flex: 1,
  },
  customAmountText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  addMoneyButton: {
    backgroundColor: '#6c63ff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addMoneyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});

