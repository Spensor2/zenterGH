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
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  // Form state
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@email.com');
  const [phone, setPhone] = useState('+233 24 XXX XXXX');
  const [avatarUri, setAvatarUri] = useState(null);

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

  const handleSave = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile has been updated successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleChangePhoto = async () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { 
          text: 'Take Photo', 
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
              return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setAvatarUri(result.assets[0].uri);
            }
          }
        },
        { 
          text: 'Choose from Gallery', 
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Gallery permission is required to select photos.');
              return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setAvatarUri(result.assets[0].uri);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <Animated.View
          style={[
            styles.avatarSection,
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>JD</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={handleChangePhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={14} color="#6c63ff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.changePhotoText}
            onPress={handleChangePhoto}
            activeOpacity={0.7}
          >
            <Text style={styles.changePhotoLabel}>
              {avatarUri ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Form Section */}
        <Animated.View
          style={[
            styles.formSection,
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="person-outline" size={18} color="#6c63ff" />
              <Text style={styles.inputLabel}>Full Name</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#bbb"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="mail-outline" size={18} color="#6c63ff" />
              <Text style={styles.inputLabel}>Email</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="call-outline" size={18} color="#6c63ff" />
              <Text style={styles.inputLabel}>Phone Number</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </Animated.View>

        {/* Additional Options */}
        <Animated.View
          style={[
            styles.optionsSection,
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Additional Options</Text>

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={[styles.optionIconBg, { backgroundColor: '#f0eeff' }]}>
              <Ionicons name="key-outline" size={20} color="#6c63ff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>Change Password</Text>
              <Text style={styles.optionDesc}>Update your password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.optionDivider} />

          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
            <View style={[styles.optionIconBg, { backgroundColor: '#e8f8f0' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#00b894" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>Verify Identity</Text>
              <Text style={styles.optionDesc}>Complete verification</Text>
            </View>
            <View style={styles.verifyBadge}>
              <Text style={styles.verifyText}>Verified</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
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

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  avatarContainer: {
    position: 'relative',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  changePhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f8f8fc',
  },

  changePhotoText: {
    marginTop: 12,
  },

  changePhotoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c63ff',
  },

  // Form Section
  formSection: {
    paddingHorizontal: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },

  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  input: {
    fontSize: 15,
    color: '#1a1a2e',
    fontWeight: '500',
    padding: 0,
  },

  // Options Section
  optionsSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  optionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  optionContent: {
    flex: 1,
  },

  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },

  optionDesc: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },

  optionDivider: {
    height: 12,
  },

  verifyBadge: {
    backgroundColor: '#e8f8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  verifyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00b894',
    textTransform: 'uppercase',
  },
});

export default EditProfileScreen;

