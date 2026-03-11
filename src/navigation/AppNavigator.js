import React, { useRef, useEffect, useCallback, useState } from 'react';
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LocationScreen from '../screens/LocationScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AccountScreen from '../screens/AccountScreen';
import WalletScreen from '../screens/WalletScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MenuScreen from '../screens/MenuScreen';
import RideBookingScreen from '../screens/RideBookingScreen';
import PackageScreen from '../screens/PackageScreen';
import ReserveScreen from '../screens/ReserveScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import RideFiltersScreen from '../screens/RideFiltersScreen';
import colors from '../constants/colors';
import PromotionsScreen from '../screens/PromotionsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import SafetyScreen from '../screens/SafetyScreen';
import RateUsScreen from '../screens/RateUsScreen';
import AddMoneyScreen from '../screens/AddMoneyScreen';
import SendScreen from '../screens/SendScreen';
import CardsScreen from '../screens/CardsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import TopUpPromoScreen from '../screens/TopUpPromoScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import LanguagesScreen from '../screens/LanguagesScreen';
import NoInternetScreen from '../screens/NoInternetScreen';
import FindingDriverScreen from '../screens/FindingDriverScreen';
import DriverFoundScreen from '../screens/DriverFoundScreen';
import RideTrackingScreen from '../screens/RideTrackingScreen';
import RideCompleteScreen from '../screens/RideCompleteScreen';
import { useNetwork } from '../context/NetworkContext';
import SearchLocationScreen from '../screens/SearchLocationScreen';
import RideOptionsScreen from '../screens/RideOptionsScreen';
import ConfirmRideScreen from '../screens/ConfirmRideScreen';
import ActiveRideScreen from '../screens/ActiveRideScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const { width: SCREEN_W } = Dimensions.get('window');

const TABS = [
  { route: 'Home', label: 'Home', icon: 'home', outline: 'home-outline' },
  { route: 'Rides', label: 'Rides', icon: 'car-sport', outline: 'car-sport-outline' },
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

const MainTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <GlassTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Rides" component={ActivityScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

const AppNavigatorContent = () => {
  const { isOffline, isReady } = useNetwork();

  return (
    <>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="Location" component={LocationScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ animation: 'slide_from_right' }} />

        <Stack.Screen name="MainTabs" options={{ animation: 'fade', gestureEnabled: false }}>
          {() =>
            isReady && isOffline ? (
              <NoInternetScreen />
            ) : (
              <MainTabs />
            )
          }
        </Stack.Screen>

        <Stack.Screen name="RideBooking" component={RideBookingScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="ConfirmRide" component={ConfirmRideScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="FindingDriver" component={FindingDriverScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="DriverFound" component={DriverFoundScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="RideTracking" component={RideTrackingScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="RideComplete" component={RideCompleteScreen} options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />

        <Stack.Screen name="Menu" component={MenuScreen} options={{ animation: 'slide_from_left' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="PackageDelivery" component={PackageScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ReserveRide" component={ReserveScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="HowItWorks" component={HowItWorksScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="RideFilters" component={RideFiltersScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Promotions" component={PromotionsScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Safety" component={SafetyScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="RateUs" component={RateUsScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Wallet" component={WalletScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="AddMoney" component={AddMoneyScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Send" component={SendScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Cards" component={CardsScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="TopUpPromo" component={TopUpPromoScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Languages" component={LanguagesScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="SearchLocation" component={SearchLocationScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="RideOptions" component={RideOptionsScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="FindDriver" component={FindingDriverScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ActiveRide" component={ActiveRideScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </>
  );
};

const AppNavigator = () => {
  return <AppNavigatorContent />;
};

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
    backgroundColor: `${ACCENT}14`,
    borderWidth: 1.5,
    borderColor: `${ACCENT}25`,
  },
  blobShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: BLOB_HEIGHT * 0.4,
    borderTopLeftRadius: BLOB_HEIGHT / 2,
    borderTopRightRadius: BLOB_HEIGHT / 2,
    backgroundColor: `${ACCENT}08`,
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

export default AppNavigator;

