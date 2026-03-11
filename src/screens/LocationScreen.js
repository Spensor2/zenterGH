import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

// Only import Location on native platforms
let Location;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

const { width } = Dimensions.get('window');

const LocationScreen = ({ navigation }) => {
  const pinBounce = useRef(new Animated.Value(0)).current;
  const pulseScale1 = useRef(new Animated.Value(0.5)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.5)).current;
  const pulseScale2 = useRef(new Animated.Value(0.5)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.4)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Pin bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(pinBounce, {
          toValue: -15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pinBounce, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse rings
    const pulse = (scale, opacity, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 2.5,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scale, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    pulse(pulseScale1, pulseOpacity1, 0).start();
    pulse(pulseScale2, pulseOpacity2, 1000).start();

    // Content fade in
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Button
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleEnableLocation = async () => {
    // On web, skip to login directly
    if (!Location) {
      navigation.replace('Login');
      return;
    }
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        navigation.replace('Login');
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is needed for the best experience. You can enable it later in settings.',
          [
            { text: 'Continue Anyway', onPress: () => navigation.replace('Login') },
            { text: 'Try Again', onPress: handleEnableLocation },
          ]
        );
      }
    } catch (error) {
      navigation.replace('Login');
    }
  };

  const handleSkipLocation = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Illustration Area */}
      <View style={styles.illustrationArea}>
        {/* Background Pattern */}
        <View style={styles.bgPattern}>
          <View style={[styles.bgDot, { top: 40, left: 30 }]} />
          <View style={[styles.bgDot, { top: 80, right: 50 }]} />
          <View style={[styles.bgDot, { top: 150, left: 60 }]} />
          <View style={[styles.bgDot, { bottom: 80, right: 40 }]} />
          <View style={[styles.bgDot, { bottom: 120, left: 40 }]} />
        </View>

        {/* Pulse Rings */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseScale1 }],
              opacity: pulseOpacity1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseScale2 }],
              opacity: pulseOpacity2,
            },
          ]}
        />

        {/* Map Pin */}
        <Animated.View
          style={[styles.pinContainer, { transform: [{ translateY: pinBounce }] }]}
        >
          <LinearGradient
            colors={[colors.primary, '#00D45A']}
            style={styles.pinGradient}
          >
            <Ionicons name="location" size={50} color={colors.white} />
          </LinearGradient>
          <View style={styles.pinShadow} />
        </Animated.View>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        <Text style={styles.title}>Enable Your Location</Text>
        <Text style={styles.description}>
          Allow zenterGh to access your location for the best ride booking and food
          delivery experience near you.
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        {/* Features */}
        <View style={styles.features}>
          {[
            { icon: 'navigate-circle-outline', text: 'Find nearby drivers' },
            { icon: 'restaurant-outline', text: 'Discover local restaurants' },
            { icon: 'time-outline', text: 'Accurate arrival times' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.enableButton}
          onPress={handleEnableLocation}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enableButtonGradient}
          >
            <Ionicons
              name="location"
              size={22}
              color={colors.white}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.enableButtonText}>Enable Location</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipLocation}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  bgDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary + '15',
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  pinContainer: {
    alignItems: 'center',
  },
  pinGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  pinShadow: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.black + '10',
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  features: {
    paddingVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  enableButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  enableButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  enableButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default LocationScreen;