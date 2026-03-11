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

const CONTACTS = [
  { id: '1', name: 'Kwame Asante', phone: '+233 55 123 4567', initial: 'KA' },
  { id: '2', name: 'Abena Mensah', phone: '+233 50 987 6543', initial: 'AM' },
  { id: '3', name: 'John Doe', phone: '+233 24 111 2222', initial: 'JD' },
  { id: '4', name: 'Sarah Williams', phone: '+233 27 333 4444', initial: 'SW' },
  { id: '5', name: 'Michael Chen', phone: '+233 20 555 6666', initial: 'MC' },
  { id: '6', name: 'Grace Osei', phone: '+233 26 777 8888', initial: 'GO' },
];

export default function SendScreen() {
  const navigation = useNavigation();
  
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = React.useState('');

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
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#999" />
              <Text style={styles.searchPlaceholder}>Search contacts or phone number</Text>
            </View>
          </View>

          {/* Recent Recipients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <View style={styles.recentRow}>
              {CONTACTS.slice(0, 5).map((contact) => (
                <TouchableOpacity key={contact.id} style={styles.recentItem} activeOpacity={0.7}>
                  <View style={styles.recentAvatar}>
                    <Text style={styles.recentInitial}>{contact.initial}</Text>
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>{contact.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* All Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Contacts</Text>
            {CONTACTS.map((contact) => (
              <TouchableOpacity 
                key={contact.id} 
                style={styles.contactItem}
                activeOpacity={0.7}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitial}>{contact.initial}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ddd" />
              </TouchableOpacity>
            ))}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e8e8ed',
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#999',
    marginLeft: 10,
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
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentItem: {
    alignItems: 'center',
    width: 60,
  },
  recentAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6c63ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recentInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  recentName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00b894',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  contactPhone: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
});

