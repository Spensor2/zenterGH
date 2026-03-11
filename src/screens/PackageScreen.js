import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PACKAGE_SIZES = [
  { id: 's', label: 'Small', icon: 'cube-outline', desc: 'Documents, keys', price: 'GHS 10-15' },
  { id: 'm', label: 'Medium', icon: 'cube', desc: 'Clothes, gadgets', price: 'GHS 20-30' },
  { id: 'l', label: 'Large', icon: 'archive-outline', desc: 'Boxes, furniture', price: 'GHS 40-60' },
];

const PackageScreen = ({ navigation }) => {
  const [selectedSize, setSelectedSize] = useState('m');
  const [senderAddress, setSenderAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [packageDesc, setPackageDesc] = useState('');

  const headerFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(40)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;

  const sizeAnims = PACKAGE_SIZES.map(() => ({
    scale: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.stagger(
          100,
          sizeAnims.map((a) =>
            Animated.spring(a.scale, {
              toValue: 1,
              friction: 6,
              tension: 80,
              useNativeDriver: true,
            })
          )
        ),
      ]),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Package</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Package Size */}
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
          <Text style={styles.sectionTitle}>Package Size</Text>
          <View style={styles.sizeGrid}>
            {PACKAGE_SIZES.map((pkg, index) => (
              <Animated.View
                key={pkg.id}
                style={{ flex: 1, transform: [{ scale: sizeAnims[index].scale }] }}
              >
                <TouchableOpacity
                  style={[
                    styles.sizeCard,
                    selectedSize === pkg.id && styles.sizeCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedSize(pkg.id)}
                >
                  <View
                    style={[
                      styles.sizeIconBg,
                      selectedSize === pkg.id && styles.sizeIconBgSelected,
                    ]}
                  >
                    <Ionicons
                      name={pkg.icon}
                      size={28}
                      color={selectedSize === pkg.id ? '#fff' : '#6c63ff'}
                    />
                  </View>
                  <Text style={styles.sizeLabel}>{pkg.label}</Text>
                  <Text style={styles.sizeDesc}>{pkg.desc}</Text>
                  <Text style={styles.sizePrice}>{pkg.price}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Addresses */}
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <View style={styles.formLabelRow}>
                <View style={styles.dotGreen} />
                <Text style={styles.formLabel}>Pickup Address</Text>
              </View>
              <TextInput
                style={styles.formInput}
                value={senderAddress}
                onChangeText={setSenderAddress}
                placeholder="Where to collect the package"
                placeholderTextColor="#bbb"
              />
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <View style={styles.formLabelRow}>
                <View style={styles.dotRed} />
                <Text style={styles.formLabel}>Delivery Address</Text>
              </View>
              <TextInput
                style={styles.formInput}
                value={receiverAddress}
                onChangeText={setReceiverAddress}
                placeholder="Where to deliver"
                placeholderTextColor="#bbb"
              />
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <View style={styles.formLabelRow}>
                <Ionicons name="call-outline" size={14} color="#6c63ff" />
                <Text style={styles.formLabel}>Receiver's Phone</Text>
              </View>
              <TextInput
                style={styles.formInput}
                value={receiverPhone}
                onChangeText={setReceiverPhone}
                placeholder="+233 XX XXX XXXX"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formDivider} />

            <View style={styles.formGroup}>
              <View style={styles.formLabelRow}>
                <Ionicons name="document-text-outline" size={14} color="#6c63ff" />
                <Text style={styles.formLabel}>Package Description</Text>
              </View>
              <TextInput
                style={styles.formInput}
                value={packageDesc}
                onChangeText={setPackageDesc}
                placeholder="What are you sending?"
                placeholderTextColor="#bbb"
              />
            </View>
          </View>
        </Animated.View>

        {/* Info Banner */}
        <Animated.View style={[styles.infoBanner, { opacity: contentFade }]}>
          <Ionicons name="shield-checkmark" size={20} color="#00b894" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Package Protection</Text>
            <Text style={styles.infoDesc}>All packages are insured up to GHS 500</Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View
        style={[styles.confirmContainer, { transform: [{ scale: buttonScale }] }]}
      >
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4A90D9', '#3a7bd5']}
            style={styles.confirmGradient}
          >
            <Ionicons name="cube" size={20} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.confirmText}>Send Package</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 12,
  },

  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },

  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },

  sizeGrid: { flexDirection: 'row', marginBottom: 28 },

  sizeCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16, marginHorizontal: 4,
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },

  sizeCardSelected: { borderColor: '#6c63ff', backgroundColor: '#fafaff' },

  sizeIconBg: {
    width: 56, height: 56, borderRadius: 18, backgroundColor: '#f0eeff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },

  sizeIconBgSelected: { backgroundColor: '#6c63ff' },

  sizeLabel: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  sizeDesc: { fontSize: 10, color: '#999', textAlign: 'center', marginBottom: 6 },
  sizePrice: { fontSize: 12, fontWeight: '700', color: '#6c63ff' },

  formCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },

  formGroup: { paddingVertical: 4 },
  formLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },

  dotGreen: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#00b894', marginRight: 8,
  },

  dotRed: {
    width: 10, height: 10, borderRadius: 3, backgroundColor: '#e74c3c', marginRight: 8,
  },

  formLabel: { fontSize: 12, fontWeight: '700', color: '#aaa', letterSpacing: 0.5 },

  formInput: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', paddingVertical: 4 },

  formDivider: { height: 1, backgroundColor: '#f5f5fa', marginVertical: 12 },

  infoBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f8f0',
    borderRadius: 16, padding: 16, marginBottom: 20,
  },

  infoTextContainer: { marginLeft: 12, flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  infoDesc: { fontSize: 12, color: '#888', marginTop: 2 },

  confirmContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20, right: 20,
  },

  confirmBtn: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#4A90D9', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },

  confirmGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 18,
  },

  confirmText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});

export default PackageScreen;