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
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { login, isAuthenticating } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(40)).current;
  const socialOpacity = useRef(new Animated.Value(0)).current;
  const socialTranslateY = useRef(new Animated.Value(30)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(socialOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(socialTranslateY, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
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

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      shakeForm();
      return;
    }

    const result = await login(email.trim(), password);

    if (result.success) {
      navigation.replace("MainTabs");
    } else {
      shakeForm();
      Alert.alert("Login Failed", result.message, [{ text: "OK" }]);
    }
  };

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
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <View style={styles.miniLogoRow}>
            <LinearGradient colors={[colors.primary, "#00D45A"]} style={styles.miniLogo}>
              <MaterialCommunityIcons name="lightning-bolt" size={22} color={colors.white} />
            </LinearGradient>
            <Text style={styles.miniLogoText}>
              zenter<Text style={{ color: colors.accent }}>Gh</Text>
            </Text>
          </View>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            styles.form,
            {
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }, { translateX: shakeAnim }],
            },
          ]}
        >
          {/* Email */}
          <View
            style={[
              styles.inputContainer,
              focusedInput === "email" && styles.inputFocused,
              errors.email && styles.inputError,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={errors.email ? "#e53935" : focusedInput === "email" ? colors.primary : colors.gray500}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: null })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              editable={!isAuthenticating}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password */}
          <View
            style={[
              styles.inputContainer,
              focusedInput === "password" && styles.inputFocused,
              errors.password && styles.inputError,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={errors.password ? "#e53935" : focusedInput === "password" ? colors.primary : colors.gray500}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: null })); }}
              secureTextEntry={!showPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              editable={!isAuthenticating}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.gray500}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isAuthenticating && { opacity: 0.7 }]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isAuthenticating}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              {isAuthenticating ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Log In</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Social */}
        <Animated.View
          style={[
            styles.socialSection,
            { opacity: socialOpacity, transform: [{ translateY: socialTranslateY }] },
          ]}
        >
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Ionicons name="logo-apple" size={24} color={colors.black} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signupLink}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signupAction}>Sign Up</Text>
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
    paddingTop: Platform.OS === "ios" ? 80 : 60, paddingBottom: 40,
  },
  header: { marginBottom: 36 },
  miniLogoRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  miniLogo: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  miniLogoText: { fontSize: 22, fontWeight: "800", color: colors.text },
  headerTitle: { fontSize: 32, fontWeight: "800", color: colors.text, marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary, fontWeight: "400" },
  form: { marginBottom: 28 },
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
  input: { flex: 1, fontSize: 16, color: colors.text, fontWeight: "500" },
  eyeButton: { padding: 4 },
  errorText: { color: "#e53935", fontSize: 12, fontWeight: "600", marginBottom: 10, marginLeft: 4 },
  forgotButton: { alignSelf: "flex-end", marginBottom: 24, marginTop: 8 },
  forgotText: { fontSize: 14, fontWeight: "600", color: colors.primary },
  loginButton: {
    borderRadius: 14, overflow: "hidden",
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  loginButtonGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 17, gap: 10,
  },
  loginButtonText: { fontSize: 17, fontWeight: "700", color: colors.white },
  socialSection: {},
  dividerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: colors.textLight, fontWeight: "500" },
  socialButtons: { flexDirection: "row", gap: 14, marginBottom: 32 },
  socialButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 14, borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.white, gap: 10,
  },
  socialButtonText: { fontSize: 15, fontWeight: "600", color: colors.text },
  signupLink: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  signupText: { fontSize: 15, color: colors.textSecondary },
  signupAction: { fontSize: 15, fontWeight: "700", color: colors.primary },
});

export default LoginScreen;