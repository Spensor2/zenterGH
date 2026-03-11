import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Platform,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.72;

const CATEGORIES = [
  { id: '1', name: 'All', icon: 'grid', active: true },
  { id: '2', name: 'Jollof', icon: 'flame', emoji: '🍚' },
  { id: '3', name: 'Burgers', icon: 'fast-food', emoji: '🍔' },
  { id: '4', name: 'Pizza', icon: 'pizza', emoji: '🍕' },
  { id: '5', name: 'Chicken', icon: 'restaurant', emoji: '🍗' },
  { id: '6', name: 'Drinks', icon: 'cafe', emoji: '🥤' },
  { id: '7', name: 'Dessert', icon: 'ice-cream', emoji: '🍰' },
  { id: '8', name: 'Healthy', icon: 'leaf', emoji: '🥗' },
];

const FEATURED = [
  {
    id: '1',
    name: 'Papaye Fast Food',
    image: null,
    rating: 4.8,
    reviews: 2340,
    delivery: '15-25 min',
    fee: 'GHS 5',
    tags: ['Chicken', 'Rice', 'Local'],
    promo: '20% OFF',
    gradient: ['#FF6B35', '#ff9a5c'],
  },
  {
    id: '2',
    name: 'KFC Ghana',
    image: null,
    rating: 4.6,
    reviews: 1856,
    delivery: '20-30 min',
    fee: 'GHS 8',
    tags: ['Chicken', 'Burgers', 'Wings'],
    promo: null,
    gradient: ['#e74c3c', '#ff6b6b'],
  },
  {
    id: '3',
    name: 'Marwako',
    image: null,
    rating: 4.7,
    reviews: 3120,
    delivery: '25-35 min',
    fee: 'GHS 6',
    tags: ['Lebanese', 'Shawarma', 'Grills'],
    promo: 'Free Delivery',
    gradient: ['#00b894', '#55efc4'],
  },
  {
    id: '4',
    name: 'Pizza Inn',
    image: null,
    rating: 4.5,
    reviews: 980,
    delivery: '30-40 min',
    fee: 'GHS 10',
    tags: ['Pizza', 'Pasta', 'Sides'],
    promo: null,
    gradient: ['#6c63ff', '#a29bfe'],
  },
];

const POPULAR = [
  {
    id: '1',
    name: 'Jollof Rice & Chicken',
    restaurant: 'Papaye Fast Food',
    price: 'GHS 35',
    rating: 4.9,
    time: '15 min',
    emoji: '🍗',
    color: '#FF6B35',
  },
  {
    id: '2',
    name: 'Shawarma Wrap',
    restaurant: 'Marwako',
    price: 'GHS 28',
    rating: 4.7,
    time: '20 min',
    emoji: '🌯',
    color: '#00b894',
  },
  {
    id: '3',
    name: 'Zinger Burger Meal',
    restaurant: 'KFC Ghana',
    price: 'GHS 55',
    rating: 4.6,
    time: '25 min',
    emoji: '🍔',
    color: '#e74c3c',
  },
  {
    id: '4',
    name: 'Pepperoni Pizza (L)',
    restaurant: 'Pizza Inn',
    price: 'GHS 85',
    rating: 4.5,
    time: '30 min',
    emoji: '🍕',
    color: '#6c63ff',
  },
  {
    id: '5',
    name: 'Banku & Tilapia',
    restaurant: 'Auntie Muni Kitchen',
    price: 'GHS 45',
    rating: 4.8,
    time: '20 min',
    emoji: '🐟',
    color: '#0984e3',
  },
  {
    id: '6',
    name: 'Waakye Special',
    restaurant: 'Waakye Joint Madina',
    price: 'GHS 20',
    rating: 4.9,
    time: '10 min',
    emoji: '🍛',
    color: '#e17055',
  },
];

const QUICK_PICKS = [
  { id: '1', name: 'Under 30 min', icon: 'time-outline', color: '#6c63ff' },
  { id: '2', name: 'Free Delivery', icon: 'bicycle-outline', color: '#00b894' },
  { id: '3', name: 'Top Rated', icon: 'star', color: '#f39c12' },
  { id: '4', name: 'Budget Meals', icon: 'pricetag-outline', color: '#e74c3c' },
];

const FeaturedCard = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 400 + index * 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 400 + index * 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featuredCard,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.96,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();
        }}
      >
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredGradient}
        >
          {/* Decorative circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          {/* Promo badge */}
          {item.promo && (
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>{item.promo}</Text>
            </View>
          )}

          {/* Restaurant info */}
          <View style={styles.featuredBottom}>
            <Text style={styles.featuredName}>{item.name}</Text>

            <View style={styles.featuredMeta}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewText}>({item.reviews})</Text>
              </View>
            </View>

            <View style={styles.featuredTags}>
              {item.tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.featuredDelivery}>
              <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.deliveryText}>{item.delivery}</Text>
              <View style={styles.deliveryDot} />
              <Ionicons name="bicycle-outline" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.deliveryText}>{item.fee}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PopularItem = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay: 600 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        delay: 600 + index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.popularCard}
        activeOpacity={0.8}
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.97,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();
        }}
      >
        <View style={[styles.popularEmojiBg, { backgroundColor: item.color + '12' }]}>
          <Text style={styles.popularEmoji}>{item.emoji}</Text>
        </View>
        <View style={styles.popularInfo}>
          <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.popularRestaurant}>{item.restaurant}</Text>
          <View style={styles.popularMeta}>
            <Ionicons name="star" size={12} color="#f39c12" />
            <Text style={styles.popularRating}>{item.rating}</Text>
            <View style={styles.popularDot} />
            <Ionicons name="time-outline" size={12} color="#aaa" />
            <Text style={styles.popularTime}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.popularPriceSection}>
          <Text style={styles.popularPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const FoodScreen = () => {
  const [activeCategory, setActiveCategory] = useState('1');
  const [searchText, setSearchText] = useState('');

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const searchFade = useRef(new Animated.Value(0)).current;
  const searchScale = useRef(new Animated.Value(0.95)).current;
  const catFade = useRef(new Animated.Value(0)).current;
  const catSlide = useRef(new Animated.Value(20)).current;
  const quickFade = useRef(new Animated.Value(0)).current;
  const sectionFade = useRef(new Animated.Value(0)).current;

  const catAnims = CATEGORIES.map(() => ({
    scale: useRef(new Animated.Value(0)).current,
  }));

  const quickAnims = QUICK_PICKS.map(() => ({
    scale: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.parallel([
        Animated.timing(searchFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(searchScale, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(catFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(catSlide, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.stagger(
          60,
          catAnims.map((a) =>
            Animated.spring(a.scale, {
              toValue: 1,
              friction: 6,
              tension: 100,
              useNativeDriver: true,
            })
          )
        ),
      ]),
      Animated.parallel([
        Animated.timing(quickFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.stagger(
          80,
          quickAnims.map((a) =>
            Animated.spring(a.scale, {
              toValue: 1,
              friction: 6,
              tension: 80,
              useNativeDriver: true,
            })
          )
        ),
      ]),
      Animated.timing(sectionFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerLabel}>Deliver to</Text>
          <TouchableOpacity style={styles.locationBtn} activeOpacity={0.7}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationText}>East Legon, Accra</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
            <Ionicons name="cart-outline" size={22} color="#1a1a2e" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: searchFade,
              transform: [{ scale: searchScale }],
            },
          ]}
        >
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants, food..."
              placeholderTextColor="#bbb"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#6c63ff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Picks */}
        <Animated.View style={{ opacity: quickFade }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScroll}
          >
            {QUICK_PICKS.map((pick, i) => (
              <Animated.View
                key={pick.id}
                style={{ transform: [{ scale: quickAnims[i].scale }] }}
              >
                <TouchableOpacity style={styles.quickChip} activeOpacity={0.7}>
                  <Ionicons name={pick.icon} size={16} color={pick.color} />
                  <Text style={styles.quickText}>{pick.name}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Categories */}
        <Animated.View
          style={[
            styles.catSection,
            { opacity: catFade, transform: [{ translateY: catSlide }] },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}
          >
            {CATEGORIES.map((cat, i) => {
              const isActive = activeCategory === cat.id;
              return (
                <Animated.View
                  key={cat.id}
                  style={{ transform: [{ scale: catAnims[i].scale }] }}
                >
                  <TouchableOpacity
                    style={[styles.catChip, isActive && styles.catChipActive]}
                    activeOpacity={0.7}
                    onPress={() => setActiveCategory(cat.id)}
                  >
                    {cat.emoji ? (
                      <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    ) : (
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={isActive ? '#fff' : '#666'}
                      />
                    )}
                    <Text
                      style={[
                        styles.catText,
                        isActive && styles.catTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Featured Restaurants */}
        <Animated.View style={{ opacity: sectionFade }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
          decelerationRate="fast"
          snapToInterval={CARD_W + 14}
        >
          {FEATURED.map((item, index) => (
            <FeaturedCard key={item.id} item={item} index={index} />
          ))}
        </ScrollView>

        {/* Special Offer Banner */}
        <Animated.View style={[styles.offerBanner, { opacity: sectionFade }]}>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={['#1a1a2e', '#2d2d5e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.offerGradient}
            >
              <View style={styles.offerContent}>
                <Text style={styles.offerEmoji}>🎉</Text>
                <View style={styles.offerTextSection}>
                  <Text style={styles.offerTitle}>Free Delivery Weekend!</Text>
                  <Text style={styles.offerDesc}>
                    Order GHS 50+ and get free delivery on all orders
                  </Text>
                </View>
              </View>
              <View style={styles.offerCodeContainer}>
                <Text style={styles.offerCode}>FREEDEL</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Popular Near You */}
        <Animated.View style={{ opacity: sectionFade }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {POPULAR.map((item, index) => (
          <PopularItem key={item.id} item={item} index={index} />
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>Explore more restaurants</Text>
          <View style={styles.footerLine} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 12,
    backgroundColor: '#f8f8fc',
  },

  headerLeft: {},

  headerLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  locationText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginHorizontal: 4,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },

  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a2e',
    marginLeft: 10,
    padding: 0,
  },

  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#f0eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Quick Picks
  quickScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  quickText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
    marginLeft: 6,
  },

  // Categories
  catSection: {
    marginBottom: 24,
  },

  catScroll: {
    paddingHorizontal: 20,
  },

  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#f0f0f5',
  },

  catChipActive: {
    backgroundColor: '#1a1a2e',
    borderColor: '#1a1a2e',
  },

  catEmoji: {
    fontSize: 16,
    marginRight: 6,
  },

  catText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },

  catTextActive: {
    color: '#fff',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c63ff',
  },

  // Featured Cards
  featuredScroll: {
    paddingLeft: 20,
    paddingRight: 6,
    paddingBottom: 8,
  },

  featuredCard: {
    width: CARD_W,
    marginRight: 14,
  },

  featuredGradient: {
    height: 200,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  decoCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  decoCircle2: {
    position: 'absolute',
    top: 20,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  promoBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  promoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  featuredBottom: {},

  featuredName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },

  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },

  reviewText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 4,
  },

  featuredTags: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },

  tagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  featuredDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deliveryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  deliveryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 8,
  },

  // Offer Banner
  offerBanner: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 28,
  },

  offerGradient: {
    borderRadius: 20,
    padding: 20,
  },

  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  offerEmoji: {
    fontSize: 36,
    marginRight: 14,
  },

  offerTextSection: {
    flex: 1,
  },

  offerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },

  offerDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },

  offerCodeContainer: {
    backgroundColor: 'rgba(108,99,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderStyle: 'dashed',
  },

  offerCode: {
    color: '#a29bfe',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Popular Items
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  popularEmojiBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  popularEmoji: {
    fontSize: 28,
  },

  popularInfo: {
    flex: 1,
  },

  popularName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  popularRestaurant: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  popularMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  popularRating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f39c12',
    marginLeft: 4,
  },

  popularDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },

  popularTime: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 4,
    fontWeight: '500',
  },

  popularPriceSection: {
    alignItems: 'flex-end',
  },

  popularPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 8,
  },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
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
    marginHorizontal: 12,
  },
});

export default FoodScreen;