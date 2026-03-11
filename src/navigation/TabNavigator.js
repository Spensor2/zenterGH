import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RidesScreen from '../screens/RidesScreen';
import WalletScreen from '../screens/WalletScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();
const { width: SCREEN_W } = Dimensions.get('window');

const TABS = [
  { route: 'Home', label: 'Home', icon: 'home', outline: 'home-outline' },
  { route: 'Rides', label: 'Rides', icon: 'car-sport', outline: 'car-sport-outline' },
  { route: 'Wallet', label: 'Wallet', icon: 'wallet', outline: 'wallet-outline' },
  { route: 'Account', label: 'Account', icon: 'person', outline: 'person-outline' },
];

const MARGIN = 20;
const BAR_WIDTH = SCREEN_W - MARGIN * 2;
const TAB_WIDTH = BAR_WIDTH / TABS.length;
const BLOB_WIDTH = TAB_WIDTH - 16;
const BLOB_HEIGHT = 44;
const BLOB_OFFSET = (TAB_WIDTH - BLOB_WIDTH) / 2;
const BAR_HEIGHT = 72;
const RADIUS = 24;
const BOTTOM = Platform.OS === 'ios' ? 28 : 14;
const ACCENT = '#000000';
const INACTIVE = '#666666';

const TabItem = ({ tab, active, onPress, animValues }) => {
  const pressScale = useRef(new Animated.Value(1)).current;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(pressScale, {
          toValue: 0.88,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(pressScale, {
          toValue: 1,
          friction: 4,
          tension: 120,
          useNativeDriver: true,
        }).start();
      }}
      activeOpacity={1}
      style={styles.tabTouch}
    >
      <Animated.View
        style={[
          styles.tabInner,
          {
            opacity: animValues.op,
            transform: [
              { scale: Animated.multiply(animValues.sc, pressScale) },
              { translateY: animValues.ty },
            ],
          },
        ]}
      >
        <Ionicons
          name={active ? tab.icon : tab.outline}
          size={23}
          color={active ? ACCENT : INACTIVE}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: active ? ACCENT : INACTIVE, fontWeight: active ? '700' : '500' },
          ]}
        >
          {tab.label}
        </Text>
        <Animated.View
          style={[
            styles.activeDot,
            { transform: [{ scale: animValues.dot }], opacity: animValues.dot },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const GlassTabBar = ({ state, navigation }) => {
  const currentIdx = state.index;

  const blobX = useRef(new Animated.Value(currentIdx * TAB_WIDTH + BLOB_OFFSET)).current;
  const blobSx = useRef(new Animated.Value(1)).current;
  const blobSy = useRef(new Animated.Value(1)).current;
  const blobGlow = useRef(new Animated.Value(0)).current;
  const entryOp = useRef(new Animated.Value(0)).current;
  const entrySlide = useRef(new Animated.Value(80)).current;

  const tabAnims = useRef(
    TABS.map((_, i) => ({
      sc: new Animated.Value(i === 0 ? 1.12 : 1),
      ty: new Animated.Value(i === 0 ? -2 : 0),
      op: new Animated.Value(i === 0 ? 1 : 0.5),
      dot: new Animated.Value(i === 0 ? 1 : 0),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(entrySlide, {
        toValue: 0,
        friction: 7,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(entryOp, {
        toValue: 1,
        duration: 700,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(blobX, {
        toValue: currentIdx * TAB_WIDTH + BLOB_OFFSET,
        friction: 6,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(blobSx, {
          toValue: 1.35,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(blobSx, {
          toValue: 1,
          friction: 3,
          tension: 140,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(blobSy, {
          toValue: 0.6,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(blobSy, {
          toValue: 1,
          friction: 3,
          tension: 140,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(blobGlow, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blobGlow, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    tabAnims.forEach((anim, i) => {
      const isActive = i === currentIdx;
      Animated.parallel([
        Animated.spring(anim.sc, {
          toValue: isActive ? 1.12 : 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.spring(anim.ty, {
          toValue: isActive ? -2 : 0,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(anim.op, {
          toValue: isActive ? 1 : 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(anim.dot, {
          toValue: isActive ? 1 : 0,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [currentIdx]);

  const navigateTo = useCallback(
    (index) => {
      const routeName = state.routes[index]?.name;
      if (routeName) navigation.navigate(routeName);
    },
    [navigation, state.routes]
  );

  return (
    <Animated.View
      style={[
        styles.barWrapper,
        { opacity: entryOp, transform: [{ translateY: entrySlide }] },
      ]}
    >
      <View style={styles.shadowLayer} />

      <View style={styles.glassBar}>
        <View style={styles.glassBase} />
        <View style={styles.glassShine} />
        <View style={styles.glassEdge} />
        <View style={styles.lightStreak1} />
        <View style={styles.lightStreak2} />

        <Animated.View
          style={[
            styles.blob,
            {
              width: BLOB_WIDTH,
              height: BLOB_HEIGHT,
              transform: [
                { translateX: blobX },
                { scaleX: blobSx },
                { scaleY: blobSy },
              ],
            },
          ]}
        >
          <View style={styles.blobFill} />
          <View style={styles.blobShine} />
          <Animated.View style={[styles.blobGlowInner, { opacity: blobGlow }]} />
        </Animated.View>

        <View style={styles.tabRow}>
          {TABS.map((tab, i) => (
            <TabItem
              key={tab.route}
              tab={tab}
              active={currentIdx === i}
              onPress={() => navigateTo(i)}
              animValues={tabAnims[i]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <GlassTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Rides" component={RidesScreen} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    bottom: BOTTOM,
    left: MARGIN,
    right: MARGIN,
    alignItems: 'center',
    zIndex: 999,
  },

  shadowLayer: {
    position: 'absolute',
    top: 4, left: 8, right: 8, bottom: -4,
    borderRadius: RADIUS,
    backgroundColor: 'rgba(0,0,0,0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      android: { elevation: 20 },
    }),
  },

  glassBar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },

  glassBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.OS === 'ios'
      ? 'rgba(255,255,255,0.82)'
      : 'rgba(255,255,255,0.96)',
    borderRadius: RADIUS,
  },

  glassShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: BAR_HEIGHT * 0.45,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },

  glassEdge: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  lightStreak1: {
    position: 'absolute',
    top: 2, left: 30, right: 30,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 1,
  },

  lightStreak2: {
    position: 'absolute',
    bottom: 3, left: 50, right: 50,
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },

  blob: {
    position: 'absolute',
    top: (BAR_HEIGHT - BLOB_HEIGHT) / 2,
    left: 0,
    borderRadius: BLOB_HEIGHT / 2,
    overflow: 'hidden',
    zIndex: 1,
  },

  blobFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BLOB_HEIGHT / 2,
    backgroundColor: ACCENT + '14',
    borderWidth: 1.5,
    borderColor: ACCENT + '25',
  },

  blobShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: BLOB_HEIGHT * 0.4,
    borderTopLeftRadius: BLOB_HEIGHT / 2,
    borderTopRightRadius: BLOB_HEIGHT / 2,
    backgroundColor: ACCENT + '08',
  },

  blobGlowInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BLOB_HEIGHT / 2,
    backgroundColor: ACCENT,
  },

  tabRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },

  tabTouch: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    marginTop: 4,
  },
});

export default TabNavigator;

