import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

const R1 = 78;
const R2 = 118;
const R3 = 156;
const HUB = R3 * 2 + 34;
const HC = HUB / 2;
const LOGO = 82;

const SplashScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOp = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.1)).current;
  const shockScale = useRef(new Animated.Value(0.5)).current;
  const shockOp = useRef(new Animated.Value(0.8)).current;

  const rOp1 = useRef(new Animated.Value(0)).current;
  const rOp2 = useRef(new Animated.Value(0)).current;
  const rOp3 = useRef(new Animated.Value(0)).current;
  const rScale1 = useRef(new Animated.Value(0.3)).current;
  const rScale2 = useRef(new Animated.Value(0.3)).current;
  const rScale3 = useRef(new Animated.Value(0.3)).current;

  const carsOp = useRef(new Animated.Value(0)).current;
  const c1 = useRef(new Animated.Value(0)).current;
  const c2 = useRef(new Animated.Value(0)).current;
  const c3 = useRef(new Animated.Value(0)).current;
  const c4 = useRef(new Animated.Value(0)).current;
  const c5 = useRef(new Animated.Value(0)).current;

  const titleOp = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const tagOp = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(18)).current;

  const loadOp = useRef(new Animated.Value(0)).current;
  const loadW = useRef(new Animated.Value(0)).current;
  const loadShimmer = useRef(new Animated.Value(0)).current;

  const dots = useRef(
    Array.from({ length: 10 }, () => ({
      y: new Animated.Value(0),
      o: new Animated.Value(0),
      x: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    run();
    return () => {};
  }, []);

  const orbitPos = (angle, radius) => ({
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  });

  const run = () => {
    // Floating ambient particles
    dots.forEach((d, i) => {
      const drift = (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 4);
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 320),
          Animated.parallel([
            Animated.timing(d.y, {
              toValue: -(40 + (i % 5) * 12),
              duration: 2400 + (i % 3) * 500,
              useNativeDriver: true,
            }),
            Animated.timing(d.x, {
              toValue: drift,
              duration: 2400 + (i % 3) * 500,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(d.o, {
                toValue: 0.5 + (i % 3) * 0.1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(d.o, {
                toValue: 0,
                duration: 1800 + (i % 3) * 500,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(d.y, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(d.x, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    });

    // Logo entrance with spring
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 45,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOp, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // Shockwave burst from logo
    Animated.parallel([
      Animated.timing(shockScale, {
        toValue: 5,
        duration: 1400,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(shockOp, {
        toValue: 0,
        duration: 1400,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.6,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.15,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Orbit rings appear with stagger
    const ringIn = (scaleRef, opRef, delay) =>
      Animated.parallel([
        Animated.timing(opRef, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(scaleRef, {
          toValue: 1,
          tension: 50,
          friction: 8,
          delay,
          useNativeDriver: true,
        }),
      ]);

    Animated.stagger(200, [
      ringIn(rScale1, rOp1, 500),
      ringIn(rScale2, rOp2, 500),
      ringIn(rScale3, rOp3, 500),
    ]).start();

    // Cars fade in
    Animated.timing(carsOp, {
      toValue: 1,
      duration: 600,
      delay: 900,
      useNativeDriver: true,
    }).start();

    // Car orbit rotations (different speeds and directions)
    Animated.loop(
      Animated.timing(c1, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(c2, {
        toValue: 1,
        duration: 5500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(c3, {
        toValue: -1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(c4, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(c5, {
        toValue: -1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Title entrance
    Animated.parallel([
      Animated.timing(titleOp, {
        toValue: 1,
        duration: 600,
        delay: 1400,
        useNativeDriver: true,
      }),
      Animated.spring(titleY, {
        toValue: 0,
        tension: 50,
        friction: 9,
        delay: 1400,
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline entrance
    Animated.parallel([
      Animated.timing(tagOp, {
        toValue: 1,
        duration: 500,
        delay: 1900,
        useNativeDriver: true,
      }),
      Animated.timing(tagY, {
        toValue: 0,
        duration: 500,
        delay: 1900,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading bar
    Animated.timing(loadOp, {
      toValue: 1,
      duration: 300,
      delay: 2300,
      useNativeDriver: false,
    }).start();

    Animated.timing(loadW, {
      toValue: 1,
      duration: 2200,
      delay: 2400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Loading shimmer loop
    Animated.loop(
      Animated.timing(loadShimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate after all animations
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 5000);
  };

  // Rotation interpolations for each car
  const rot1 = c1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rot2 = c2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rot3 = c3.interpolate({ inputRange: [-1, 0], outputRange: ['-360deg', '0deg'] });
  const rot4 = c4.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rot5 = c5.interpolate({ inputRange: [-1, 0], outputRange: ['-360deg', '0deg'] });

  // Counter-rotation so car icons stay upright
  const cRot1 = c1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });
  const cRot2 = c2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });
  const cRot3 = c3.interpolate({ inputRange: [-1, 0], outputRange: ['360deg', '0deg'] });
  const cRot4 = c4.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });
  const cRot5 = c5.interpolate({ inputRange: [-1, 0], outputRange: ['360deg', '0deg'] });

  const shimmerX = loadShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, W * 0.5],
  });

  const cars = [
    { rot: rot1, cRot: cRot1, r: R1, start: 0, icon: 'car-sport', size: 18, color: '#00E676' },
    { rot: rot2, cRot: cRot2, r: R2, start: 72, icon: 'car', size: 16, color: '#69F0AE' },
    { rot: rot3, cRot: cRot3, r: R3, start: 144, icon: 'car-sport', size: 20, color: '#B2FF59' },
    { rot: rot4, cRot: cRot4, r: R2, start: 216, icon: 'car', size: 15, color: '#76FF03' },
    { rot: rot5, cRot: cRot5, r: R1, start: 288, icon: 'car-sport', size: 17, color: '#00E5FF' },
  ];

  // Positions for ambient dots
  const dotPositions = [
    { top: H * 0.12, left: W * 0.1, size: 4 },
    { top: H * 0.18, right: W * 0.08, size: 6 },
    { top: H * 0.32, left: W * 0.85, size: 3 },
    { top: H * 0.45, left: W * 0.05, size: 5 },
    { top: H * 0.58, right: W * 0.1, size: 4 },
    { top: H * 0.7, left: W * 0.15, size: 7 },
    { top: H * 0.75, right: W * 0.2, size: 3 },
    { top: H * 0.82, left: W * 0.6, size: 5 },
    { top: H * 0.2, left: W * 0.55, size: 3 },
    { top: H * 0.65, left: W * 0.35, size: 4 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a1a', '#0d0d2b', '#08081a']}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient floating particles */}
      {dots.map((d, i) => (
        <Animated.View
          key={`dot-${i}`}
          style={[
            styles.ambientDot,
            {
              top: dotPositions[i].top,
              left: dotPositions[i].left,
              right: dotPositions[i].right,
              width: dotPositions[i].size,
              height: dotPositions[i].size,
              borderRadius: dotPositions[i].size / 2,
              opacity: d.o,
              transform: [{ translateY: d.y }, { translateX: d.x }],
            },
          ]}
        />
      ))}

      {/* Radial glow behind everything */}
      <Animated.View style={[styles.radialGlow, { opacity: glowPulse }]} />

      {/* Main orbit hub */}
      <View style={styles.hubContainer}>
        {/* Shockwave burst */}
        <Animated.View
          style={[
            styles.shockwave,
            {
              transform: [{ scale: shockScale }],
              opacity: shockOp,
            },
          ]}
        />

        {/* Orbit ring 1 */}
        <Animated.View
          style={[
            styles.orbitRing,
            {
              width: R1 * 2,
              height: R1 * 2,
              borderRadius: R1,
              opacity: rOp1,
              transform: [{ scale: rScale1 }],
            },
          ]}
        />

        {/* Orbit ring 2 */}
        <Animated.View
          style={[
            styles.orbitRing,
            styles.orbitRing2,
            {
              width: R2 * 2,
              height: R2 * 2,
              borderRadius: R2,
              opacity: rOp2,
              transform: [{ scale: rScale2 }],
            },
          ]}
        />

        {/* Orbit ring 3 */}
        <Animated.View
          style={[
            styles.orbitRing,
            styles.orbitRing3,
            {
              width: R3 * 2,
              height: R3 * 2,
              borderRadius: R3,
              opacity: rOp3,
              transform: [{ scale: rScale3 }],
            },
          ]}
        />

        {/* Orbiting cars */}
        <Animated.View style={[styles.carsLayer, { opacity: carsOp }]}>
          {cars.map((car, i) => {
            const startRad = (car.start * Math.PI) / 180;
            const startPos = orbitPos(startRad, car.r);

            return (
              <Animated.View
                key={`car-${i}`}
                style={[
                  styles.carOrbitAnchor,
                  {
                    transform: [{ rotate: car.rot }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.carPositioner,
                    {
                      left: HC + startPos.x - 16,
                      top: HC + startPos.y - 16,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.carBubble,
                      {
                        transform: [{ rotate: car.cRot }],
                      },
                    ]}
                  >
                    <View style={[styles.carGlow, { backgroundColor: car.color + '30' }]} />
                    <Ionicons name={car.icon} size={car.size} color={car.color} />
                  </Animated.View>
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Central logo */}
        <Animated.View
          style={[
            styles.logoOuter,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOp,
            },
          ]}
        >
          {/* Logo glow ring */}
          <Animated.View style={[styles.logoGlowRing, { opacity: glowPulse }]} />

          <LinearGradient
            colors={[colors.primary, '#00D45A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logoZ}>Z</Text>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.View
        style={[
          styles.titleBlock,
          {
            opacity: titleOp,
            transform: [{ translateY: titleY }],
          },
        ]}
      >
        <Text style={styles.title}>
          zenter<Text style={styles.titleAccent}>Gh</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={{
          opacity: tagOp,
          transform: [{ translateY: tagY }],
        }}
      >
        <Text style={styles.tagline}>Ride & Eat, All in One</Text>
      </Animated.View>

      {/* Loading bar */}
      <Animated.View style={[styles.loadContainer, { opacity: loadOp }]}>
        <Animated.View
          style={[
            styles.loadFill,
            {
              width: loadW.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, '#00D45A', colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loadGradient}
          />
          {/* Shimmer */}
          <Animated.View
            style={[
              styles.loadShimmerBar,
              {
                transform: [{ translateX: shimmerX }],
              },
            ]}
          />
        </Animated.View>
        <Animated.View style={styles.loadDot}>
          <View style={styles.loadDotInner} />
        </Animated.View>
      </Animated.View>

      {/* Bottom decorative text */}
      <Animated.View style={[styles.bottomBrand, { opacity: tagOp }]}>
        <View style={styles.brandLine} />
        <Text style={styles.brandText}>GHANA'S RIDE & FOOD PLATFORM</Text>
        <View style={styles.brandLine} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a1a',
  },

  // Ambient particles
  ambientDot: {
    position: 'absolute',
    backgroundColor: '#00E676',
  },

  // Radial glow
  radialGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.primary,
    opacity: 0.08,
  },

  // Orbit hub
  hubContainer: {
    width: HUB,
    height: HUB,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },

  // Shockwave
  shockwave: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  // Orbit rings
  orbitRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.18)',
    borderStyle: 'dashed',
  },

  orbitRing2: {
    borderColor: 'rgba(0,230,118,0.12)',
    borderStyle: 'solid',
  },

  orbitRing3: {
    borderColor: 'rgba(0,230,118,0.07)',
    borderStyle: 'dashed',
  },

  // Cars orbit layer
  carsLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  carOrbitAnchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HUB,
    height: HUB,
  },

  carPositioner: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,230,118,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  carGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },

  // Central logo
  logoOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 40,
    elevation: 30,
  },

  logoGlowRing: {
    position: 'absolute',
    width: LOGO + 30,
    height: LOGO + 30,
    borderRadius: (LOGO + 30) / 2,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  logoGradient: {
    width: LOGO,
    height: LOGO,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoZ: {
    fontSize: 44,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    fontStyle: 'italic',
  },

  // Title
  titleBlock: {
    marginBottom: 8,
  },

  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1.5,
  },

  titleAccent: {
    color: '#00E676',
    fontWeight: '900',
  },

  // Tagline
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 2,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // Loading bar
  loadContainer: {
    width: W * 0.5,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    marginTop: 48,
    overflow: 'hidden',
    position: 'relative',
  },

  loadFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },

  loadGradient: {
    flex: 1,
  },

  loadShimmerBar: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },

  loadDot: {
    position: 'absolute',
    right: -4,
    top: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,230,118,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00E676',
  },

  // Bottom brand
  bottomBrand: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  brandLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  brandText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 3,
    fontWeight: '600',
    marginHorizontal: 14,
  },
});

export default SplashScreen;