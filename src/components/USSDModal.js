import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Linking,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../context/NetworkContext';
import { usePendingRides } from '../context/PendingRidesContext';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const USSD_OPTIONS = [
  {
    id: 'quick_book',
    title: 'Quick Book',
    description: 'Book a ride immediately',
    code: '*713*1#',
    icon: 'car-sport',
    color: '#00b894',
    action: 'book',
  },
  {
    id: 'schedule',
    title: 'Schedule Ride',
    description: 'Book for a later time',
    code: '*713*2#',
    icon: 'calendar',
    color: '#9B59B6',
    action: 'schedule',
  },
  {
    id: 'status',
    title: 'Check Status',
    description: 'View pending rides',
    code: '*713*3#',
    icon: 'time',
    color: '#6c63ff',
    action: 'status',
  },
];

const USSDModal = ({ visible, onClose, navigation }) => {
  const { isOffline } = useNetwork();
  const { pendingRides, hasPendingRides } = usePendingRides();

  // Animations
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.parallel([
            Animated.timing(modalScale, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.back(1.5)),
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleDialUSSD = (code) => {
    try {
      const telUrl = `tel:${code}`;
      
      Linking.canOpenURL(telUrl).then((supported) => {
        if (supported) {
          Linking.openURL(telUrl);
          onClose();
        } else {
          Alert.alert(
            'USSD Not Supported',
            'Your device does not support USSD codes.',
            [{ text: 'OK' }]
          );
        }
      });
    } catch (error) {
      console.log('Error dialing USSD:', error);
    }
  };

  const handleAction = (option) => {
    onClose();
    
    // Navigate based on action
    setTimeout(() => {
      try {
        const parent = navigation?.getParent ? navigation.getParent() : null;
        
        switch (option.action) {
          case 'book':
            if (parent) {
              parent.navigate('RideBooking');
            } else if (navigation) {
              navigation.navigate('RideBooking');
            }
            break;
          case 'schedule':
            if (parent) {
              parent.navigate('ReserveRide');
            } else if (navigation) {
              navigation.navigate('ReserveRide');
            }
            break;
          case 'status':
            // Could navigate to a pending rides screen
            if (hasPendingRides) {
              Alert.alert(
                'Pending Rides',
                `You have ${pendingRides.length} pending ride(s) that will be processed when you're back online.`,
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert(
                'No Pending Rides',
                'You have no pending rides at the moment.',
                [{ text: 'OK' }]
              );
            }
            break;
        }
      } catch (error) {
        console.log('Navigation error:', error);
      }
    }, 300);
  };

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.container, 
          { opacity: backdropOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleBackdropPress}
        />
        
        <Animated.View 
          style={[
            styles.modal, 
            { 
              opacity: modalOpacity,
              transform: [{ scale: modalScale }] 
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="radio" size={24} color="#6c63ff" />
              </View>
              <View>
                <Text style={styles.title}>USSD Booking</Text>
                <Text style={styles.subtitle}>
                  {isOffline ? 'Book rides without internet' : 'Quick access to USSD codes'}
                </Text>
              </View>
            </View>
          </View>

          {/* Offline Indicator */}
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline" size={14} color="#e74c3c" />
              <Text style={styles.offlineText}>You're offline</Text>
            </View>
          )}

          {/* Pending Rides Info */}
          {hasPendingRides && (
            <View style={styles.pendingInfo}>
              <Ionicons name="time" size={16} color={colors.accent} />
              <Text style={styles.pendingText}>
                {pendingRides.length} ride(s) queued for processing
              </Text>
            </View>
          )}

          {/* Options */}
          <View style={styles.options}>
            {USSD_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                activeOpacity={0.7}
                onPress={() => {
                  if (option.action === 'status') {
                    handleAction(option);
                  } else {
                    handleDialUSSD(option.code);
                  }
                }}
              >
                <View style={[styles.optionIconBg, { backgroundColor: option.color + '15' }]}>
                  <Ionicons name={option.icon} size={22} color={option.color} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDesc}>{option.description}</Text>
                </View>
                <View style={styles.optionCode}>
                  <Text style={styles.codeText}>{option.code}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Dial the code to book via USSD{'\n'}Rides will queue until you're back online
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingHorizontal: 20,
  },
  
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  
  header: {
    marginBottom: 16,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#6c63ff15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  
  offlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 6,
  },
  
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '12',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  
  pendingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
    marginLeft: 6,
  },
  
  options: {
    gap: 10,
  },
  
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: 16,
    padding: 14,
  },
  
  optionIconBg: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  
  optionContent: {
    flex: 1,
  },
  
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  
  optionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  
  optionCode: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default USSDModal;

