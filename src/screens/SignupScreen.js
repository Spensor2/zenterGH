import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = ({ navigation }) => {
  const { signup, googleAuth, isAuthenticating } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  /*
   * ⚠️  REPLACE these with your real Google OAuth Client IDs
   *     Get them from: https://console.cloud.google.com/apis/credentials
   */
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  /* handle Google response */
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleToken(authentication.accessToken);
    } else if (response?.type === "error") {
      Alert.alert("Google Sign-In Failed", "Something went wrong. Try again.");
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleToken = async (accessToken) => {
    try {
      setGoogleLoading(true);

      /* fetch Google profile */
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const googleUser = await userInfoResponse.json();

      if (!googleUser.email) {
        Alert.alert("Error", "Could not get your Google account info.");
        setGoogleLoading(false);
        return;
      }

      /* send to our backend */
      const result = await googleAuth({
        googleId: googleUser.id,
        email: googleUser.email,
        fullName: googleUser.name,
        profilePicture: googleUser.picture,
      });

      if (result.success) {
        navigation.replace("MainTabs");
      } else {
        Alert.alert("Sign-In Failed", result.message, [{ text: "OK" }]);
      }
    } catch (error) {
      console.log("Google auth error:", error);
      Alert.alert("Error", "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await promptAsync();
    } catch (error) {
      console.log("Google prompt error:", error);
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0, duration: 500, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0, duration: 500, useNativeDriver: true,
        }),
      ]),
      Animated.timing(bottomOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    else if (fullName.trim().length < 2) newErrors.fullName = "Name too short";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (phone.trim().length < 9) newErrors.phone = "Enter a valid phone number";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!acceptTerms) newErrors.terms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) { shakeForm(); return; }

    const fullPhone = `+233${phone.trim().replace(/^0+/, "")}`;
    const result = await signup(fullName.trim(), email.trim(), fullPhone, password);

    if (result.success) {
      navigation.replace("MainTabs");
    } else {
      shakeForm();
      Alert.alert("Signup Failed", result.message || "Unknown error", [{ text: "OK" }]);
    }
  };

  const clearError = (field) => setErrors((e) => ({ ...e, [field]: null }));

  const InputField = ({
    icon, placeholder, value, onChangeText,
    keyboardType, secureTextEntry, fieldName, prefix, rightElement,
  }) => (
    <>
      <View
        style={[
          styles.inputContainer,
          focusedInput === fieldName && styles.inputFocused,
          errors[fieldName] && styles.inputError,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={
            errors[fieldName]
              ? "#e53935"
              : focusedInput === fieldName
              ? colors.primary
              : colors.gray500
          }
          style={styles.inputIcon}
        />
        {prefix && <Text style={styles.inputPrefix}>{prefix}</Text>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={(t) => { onChangeText(t); clearError(fieldName); }}
          keyboardType={keyboardType || "default"}
          secureTextEntry={secureTextEntry}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
          onFocus={() => setFocusedInput(fieldName)}
          onBlur={() => setFocusedInput(null)}
          editable={!isAuthenticating && !googleLoading}
        />
        {rightElement}
      </View>
      {errors[fieldName] && (
        <Text style={styles.errorText}>{errors[fieldName]}</Text>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.header,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>
            Join zenterGh and start your journey today
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.form,
            {
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }, { translateX: shakeAnim }],
            },
          ]}
        >
          <InputField icon="person-outline" placeholder="Full Name" value={fullName} onChangeText={setFullName} fieldName="fullName" />
          <InputField icon="mail-outline" placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" fieldName="email" />
          <InputField icon="call-outline" placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" fieldName="phone" prefix="+233" />
          <InputField
            icon="lock-closed-outline" placeholder="Password" value={password}
            onChangeText={setPassword} secureTextEntry={!showPassword} fieldName="password"
            rightElement={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.gray500} />
              </TouchableOpacity>
            }
          />

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => { setAcceptTerms(!acceptTerms); clearError("terms"); }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked, errors.terms && styles.checkboxError]}>
              {acceptTerms && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, (!acceptTerms || isAuthenticating || googleLoading) && styles.buttonDisabled]}
            onPress={handleSignup}
            activeOpacity={0.85}
            disabled={!acceptTerms || isAuthenticating || googleLoading}
          >
            <LinearGradient
              colors={acceptTerms ? [colors.primary, colors.primaryDark] : [colors.gray400, colors.gray500]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signupButtonGradient}
            >
              {isAuthenticating ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom — Google is functional, others are visual only */}
        <Animated.View style={[styles.bottomSection, { opacity: bottomOpacity }]}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            {/* ✅ GOOGLE — FUNCTIONAL */}
            <TouchableOpacity
              style={[styles.googleButton, googleLoading && { opacity: 0.6 }]}
              activeOpacity={0.8}
              onPress={handleGoogleSignIn}
              disabled={googleLoading || isAuthenticating || !request}
            >
              {googleLoading ? (
                <ActivityIndicator color="#DB4437" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="google" size={22} color="#DB4437" />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginAction}>Log In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: {
    flexGrow: 1, paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 45, paddingBottom: 40,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.gray100,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 30, fontWeight: "800", color: colors.text, marginBottom: 8 },
  headerSubtitle: { fontSize: 15, color: colors.textSecondary },
  form: { marginBottom: 24 },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: colors.gray100,
    borderRadius: 14, paddingHorizontal: 16, marginBottom: 6,
    borderWidth: 1.5, borderColor: "transparent", height: 56,
  },
  inputFocused: {
    borderColor: colors.primary, backgroundColor: colors.white,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  inputError: { borderColor: "#e53935", backgroundColor: "#fff5f5" },
  inputIcon: { marginRight: 12 },
  inputPrefix: {
    fontSize: 16, fontWeight: "600", color: colors.text,
    marginRight: 8, paddingRight: 8, borderRightWidth: 1, borderRightColor: colors.border,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, fontWeight: "500" },
  eyeButton: { padding: 4 },
  errorText: { color: "#e53935", fontSize: 12, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
  termsRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8, marginTop: 8 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.gray400,
    alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 1,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxError: { borderColor: "#e53935" },
  termsText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  termsLink: { color: colors.primary, fontWeight: "600" },
  signupButton: {
    borderRadius: 14, overflow: "hidden", marginTop: 8,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  buttonDisabled: { shadowOpacity: 0, elevation: 0 },
  signupButtonGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 17, gap: 10,
  },
  signupButtonText: { fontSize: 17, fontWeight: "700", color: colors.white },
  bottomSection: {},
  dividerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: colors.textLight, fontWeight: "500" },
  socialButtons: { marginBottom: 28 },
  googleButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  googleButtonText: { fontSize: 16, fontWeight: "600", color: colors.text },
  loginLink: { flexDirection: "row", justifyContent: "center" },
  loginText: { fontSize: 15, color: colors.textSecondary },
  loginAction: { fontSize: 15, fontWeight: "700", color: colors.primary },
});

export default SignupScreen;