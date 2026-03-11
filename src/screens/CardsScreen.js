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

const CARDS = [
  { 
    id: '1', 
    type: 'Visa', 
    number: '•••• •••• •••• 4821', 
    expiry: '12/26', 
    color: '#1a1a2e',
    gradient: ['#1a1a2e', '#2d2d44']
  },
  { 
    id: '2', 
    type: 'Mastercard', 
    number: '•••• •••• •••• 8890', 
    expiry: '08/25', 
    color: '#eb001b',
    gradient: ['#eb001b', '#f79e1b']
  },
];

export default function CardsScreen() {
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
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
          <Ionicons name="add" size={24} color="#6c63ff" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Cards</Text>
            {CARDS.map((card) => (
              <View key={card.id} style={[styles.card, { backgroundColor: card.gradient[0] }]}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardType}>{card.type}</Text>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardNumber}>{card.number}</Text>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.cardLabel}>Card Holder</Text>
                    <Text style={styles.cardValue}>KWAME ASANTE</Text>
                  </View>
                  <View>
                    <Text style={styles.cardLabel}>Expires</Text>
                    <Text style={styles.cardValue}>{card.expiry}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Virtual Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Virtual Card</Text>
            <TouchableOpacity style={styles.virtualCard} activeOpacity={0.7}>
              <View style={styles.virtualCardTop}>
                <View style={styles.virtualCardIcon}>
                  <Ionicons name="wallet" size={24} color="#6c63ff" />
                </View>
                <View style={styles.virtualCardInfo}>
                  <Text style={styles.virtualCardTitle}>Zenter Virtual Card</Text>
                  <Text style={styles.virtualCardSubtitle}>For online payments</Text>
                </View>
              </View>
              <View style={styles.virtualCardBalance}>
                <Text style={styles.virtualCardLabel}>Available Balance</Text>
                <Text style={styles.virtualCardAmount}>GHS 50.00</Text>
              </View>
              <View style={styles.virtualCardActions}>
                <TouchableOpacity style={styles.virtualCardAction} activeOpacity={0.7}>
                  <Ionicons name="add-circle" size={20} color="#6c63ff" />
                  <Text style={styles.virtualCardActionText}>Top Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.virtualCardAction} activeOpacity={0.7}>
                  <Ionicons name="eye" size={20} color="#6c63ff" />
                  <Text style={styles.virtualCardActionText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* Card Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Settings</Text>
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingIcon}>
                <Ionicons name="lock-closed" size={20} color="#6c63ff" />
              </View>
              <Text style={styles.settingLabel}>Card Limits</Text>
              <Ionicons name="chevron-forward" size={20} color="#ddd" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingIcon}>
                <Ionicons name="globe" size={20} color="#6c63ff" />
              </View>
              <Text style={styles.settingLabel}>International Usage</Text>
              <Ionicons name="chevron-forward" size={20} color="#ddd" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingIcon}>
                <Ionicons name="notifications" size={20} color="#6c63ff" />
              </View>
              <Text style={styles.settingLabel}>Transaction Alerts</Text>
              <Ionicons name="chevron-forward" size={20} color="#ddd" />
            </TouchableOpacity>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 24,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  virtualCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e8e8ed',
  },
  virtualCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  virtualCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  virtualCardInfo: {
    flex: 1,
  },
  virtualCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  virtualCardSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  virtualCardBalance: {
    backgroundColor: '#f8f8fc',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  virtualCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  virtualCardAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  virtualCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  virtualCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0eeff',
    borderRadius: 12,
  },
  virtualCardActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6c63ff',
    marginLeft: 6,
  },
  settingItem: {
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
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});

