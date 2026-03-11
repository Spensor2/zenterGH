import React, { useRef, useEffect, useState } from 'react';
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

const LANGUAGES = [
  { id: '1', name: 'English', code: 'EN', flag: '🇬🇧', selected: true },
  { id: '2', name: 'French', code: 'FR', flag: '🇫🇷', selected: false },
  { id: '3', name: 'Spanish', code: 'ES', flag: '🇪🇸', selected: false },
  { id: '4', name: 'German', code: 'DE', flag: '🇩🇪', selected: false },
  { id: '5', name: 'Portuguese', code: 'PT', flag: '🇵🇹', selected: false },
  { id: '6', name: 'Chinese', code: 'ZH', flag: '🇨🇳', selected: false },
  { id: '7', name: 'Japanese', code: 'JA', flag: '🇯🇵', selected: false },
  { id: '8', name: 'Arabic', code: 'AR', flag: '🇸🇦', selected: false },
];

const LanguageItem = ({ language, index, onSelect, isSelected }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 60,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 200 + index * 60,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.languageItem,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.languageRow}
        activeOpacity={0.7}
        onPress={() => onSelect(language.id)}
      >
        <View style={styles.languageLeft}>
          <Text style={styles.languageFlag}>{language.flag}</Text>
          <View style={styles.languageInfo}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageCode}>{language.code}</Text>
          </View>
        </View>
        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LanguagesScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const [selectedLanguage, setSelectedLanguage] = useState('1');

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
      ]),
    ]).start();
  }, []);

  const handleSelectLanguage = (id) => {
    setSelectedLanguage(id);
  };

  const handleSave = () => {
    const selectedLang = LANGUAGES.find((lang) => lang.id === selectedLanguage);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Language Banner */}
        <Animated.View
          style={[
            styles.currentLangBanner,
            { opacity: contentFade, transform: [{ translateY: contentSlide }] },
          ]}
        >
          <View style={styles.currentLangContent}>
            <Ionicons name="globe" size={24} color="#6c63ff" />
            <View style={styles.currentLangInfo}>
              <Text style={styles.currentLangLabel}>Current Language</Text>
              <Text style={styles.currentLangName}>
                {LANGUAGES.find((l) => l.id === selectedLanguage)?.name}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Language List */}
        <Animated.View style={{ opacity: contentFade }}>
          <Text style={styles.sectionTitle}>Select Language</Text>
          <View style={styles.languageGroup}>
            {LANGUAGES.map((language, index) => (
              <LanguageItem
                key={language.id}
                language={language}
                index={index}
                onSelect={handleSelectLanguage}
                isSelected={selectedLanguage === language.id}
              />
            ))}
          </View>
        </Animated.View>

        {/* Info Section */}
        <Animated.View
          style={[styles.infoSection, { opacity: contentFade }]}
        >
          <View style={styles.infoIconBg}>
            <Ionicons name="information-circle" size={20} color="#6c63ff" />
          </View>
          <Text style={styles.infoText}>
            The app language will change immediately after selection. Some
            translations may vary based on your region.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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

  backBtn: {
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
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#6c63ff',
    borderRadius: 12,
  },

  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  // Current Language Banner
  currentLangBanner: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  currentLangContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  currentLangInfo: {
    marginLeft: 14,
  },

  currentLangLabel: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '600',
  },

  currentLangName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    marginTop: 2,
  },

  // Section Title
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Language List
  languageGroup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  languageItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5fa',
  },

  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  languageFlag: {
    fontSize: 28,
    marginRight: 14,
  },

  languageInfo: {
    flex: 1,
  },

  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },

  languageCode: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: '#6c63ff',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6c63ff',
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#f0eeff',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },

  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

export default LanguagesScreen;

