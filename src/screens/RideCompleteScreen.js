import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRide } from '../context/RideContext';

const { width } = Dimensions.get('window');

const RideCompleteScreen = ({ navigation }) => {
  const { rideState, resetRide } = useRide();
  const { driver, pickup, dropoff, rideType, estimatedPrice, distance } = rideState || {};

  const [actualFare, setActualFare] = React.useState(estimatedPrice || 44);
  const [tripDuration, setTripDuration] = React.useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Generate random final stats
    const finalFare = Math.round((estimatedPrice || 44) * (0.9 + Math.random() * 0.2));
    setActualFare(finalFare);
    setTripDuration(Math.floor(Math.random() * 20) + 5);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Show rating modal after 3 seconds
    const ratingTimer = setTimeout(() => {
      setShowRatingModal(true);
    }, 3000);

    return () => clearTimeout(ratingTimer);
  }, []);

  const handleDone = () => {
    resetRide();
    navigation.navigate('MainTabs');
  };

  const handleRateDriver = (rating) => {
    setSelectedRating(rating);
    // Close modal and navigate after a brief moment
    setTimeout(() => {
      setShowRatingModal(false);
      resetRide();
      navigation.navigate('MainTabs');
    }, 500);
  };

  const handleReport = () => {
    // Navigate to help/support
  };

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <Animated.View 
        style={[
          styles.successContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={50} color="#fff" />
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Trip Complete!</Text>
        <Text style={styles.subtitle}>Thanks for riding with us</Text>

        {/* Driver Info */}
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={30} color="#6c63ff" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver?.name || 'Driver'}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#f39c12" />
              <Text style={styles.ratingText}>{driver?.rating || '4.9'}</Text>
              <Text style={styles.carText}>• {driver?.car || 'Toyota Camry'}</Text>
            </View>
          </View>
        </View>

        {/* Trip Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>From</Text>
            <Text style={styles.summaryValue}>{pickup?.name || 'Current Location'}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>To</Text>
            <Text style={styles.summaryValue}>{dropoff?.name || 'Destination'}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="navigate" size={20} color="#6c63ff" />
              <Text style={styles.statValue}>{distance} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={20} color="#6c63ff" />
              <Text style={styles.statValue}>{tripDuration} min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="car-sport" size={20} color="#6c63ff" />
              <Text style={styles.statValue}>{rideType?.name || 'Standard'}</Text>
              <Text style={styles.statLabel}>Vehicle</Text>
            </View>
          </View>
        </View>

        {/* Fare Breakdown */}
        <View style={styles.fareCard}>
          <Text style={styles.fareTitle}>Fare Details</Text>
          
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Base Fare</Text>
            <Text style={styles.fareValue}>GHS {Math.round(estimatedPrice * 0.6)}</Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Distance ({distance} km)</Text>
            <Text style={styles.fareValue}>GHS {Math.round(estimatedPrice * 0.3)}</Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Time</Text>
            <Text style={styles.fareValue}>GHS {Math.round(estimatedPrice * 0.1)}</Text>
          </View>
          
          <View style={styles.fareDivider} />
          
          <View style={styles.fareRow}>
            <Text style={styles.fareLabelTotal}>Total</Text>
            <Text style={styles.fareValueTotal}>GHS {actualFare}</Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentIcon}>
            <Ionicons name="wallet" size={24} color="#00b894" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Paid via Wallet</Text>
            <Text style={styles.paymentValue}>GHS {actualFare}</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <LinearGradient
            colors={['#6c63ff', '#5a52d5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneGradient}
          >
            <Text style={styles.doneText}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Ionicons name="flag" size={18} color="#e74c3c" />
          <Text style={styles.reportText}>Report an issue</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModal}>
            <View style={styles.ratingHeader}>
              <Ionicons name="star" size={32} color="#f39c12" />
              <Text style={styles.ratingTitle}>Rate Your Trip</Text>
              <Text style={styles.ratingSubtitle}>
                How was your ride with {driver?.name || 'the driver'}?
              </Text>
            </View>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRateDriver(star)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={star <= selectedRating ? "star" : "star-outline"}
                    size={40}
                    color="#f39c12"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingHint}>
              Tap a star to rate
            </Text>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                setShowRatingModal(false);
                resetRide();
                navigation.navigate('MainTabs');
              }}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00b894',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6c63ff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1,
    marginLeft: 14,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
    marginLeft: 4,
  },
  carText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#999',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    flex: 1,
    textAlign: 'right',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f0f5',
    marginVertical: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f5',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  fareCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  fareLabel: {
    fontSize: 14,
    color: '#666',
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  fareDivider: {
    height: 1,
    backgroundColor: '#f0f0f5',
    marginVertical: 12,
  },
  fareLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  fareValueTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00b89415',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#00b89420',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#666',
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 2,
  },
  doneButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  doneGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  reportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  // Rating Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ratingModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  ratingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    marginTop: 12,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  starButton: {
    padding: 8,
  },
  ratingHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default RideCompleteScreen;

