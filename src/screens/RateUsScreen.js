import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const EMOJIS = ['😞', '😕', '😐', '🙂', '😍'];
const LABELS = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'];

const RateUsScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successFade = useRef(new Animated.Value(0)).current;

  const starAnims = [1, 2, 3, 4, 5].map(() => ({
    scale: useRef(new Animated.Value(0)).current,
    bounce: useRef(new Animated.Value(1)).current,
  }));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(contentSlide, {
          toValue: 0, duration: 500, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.stagger(80,
        starAnims.map(a =>
          Animated.spring(a.scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true })
        )
      ),
    ]).start();
  }, []);

  const handleStar = (i) => {
    setRating(i);
    Animated.sequence([
      Animated.timing(starAnims[i - 1].bounce, {
        toValue: 1.4, duration: 100, useNativeDriver: true,
      }),
      Animated.spring(starAnims[i - 1].bounce, {
        toValue: 1, friction: 3, tension: 100, useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(emojiScale, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.spring(emojiScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    Animated.parallel([
      Animated.spring(successScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(successFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    setTimeout(() => navigation.goBack(), 2500);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Animated.View style={[styles.successContent, { opacity: successFade, transform: [{ scale: successScale }] }]}>
          <View style={styles.successIconBg}>
            <Ionicons name="heart" size={48} color="#e74c3c" />
          </View>
          <Text style={styles.successTitle}>Thank You! ❤️</Text>
          <Text style={styles.successDesc}>
            Your feedback helps us improve.{'\n'}We appreciate your support!
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Us</Text>
        <View style={{ width: 44 }} />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
        <View style={styles.emojiSection}>
          {rating > 0 && (
            <Animated.Text style={[styles.emoji, { transform: [{ scale: emojiScale }] }]}>
              {EMOJIS[rating - 1]}
            </Animated.Text>
          )}
          {rating === 0 && <Text style={styles.emojiPlaceholder}>⭐</Text>}
          {rating > 0 && <Text style={styles.ratingLabel}>{LABELS[rating - 1]}</Text>}
        </View>

        <Text style={styles.rateTitle}>How's your experience?</Text>
        <Text style={styles.rateDesc}>Tap a star to rate zenterGh</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Animated.View
              key={i}
              style={{ transform: [{ scale: Animated.multiply(starAnims[i - 1].scale, starAnims[i - 1].bounce) }] }}
            >
              <TouchableOpacity
                onPress={() => handleStar(i)}
                activeOpacity={0.7}
                style={styles.starBtn}
              >
                <Ionicons
                  name={i <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={i <= rating ? '#f39c12' : '#ddd'}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {rating > 0 && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackLabel}>Tell us more (optional)</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="What can we improve?"
              placeholderTextColor="#bbb"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleSubmit}>
              <LinearGradient
                colors={['#6c63ff', '#5a52d5']}
                style={styles.submitGradient}
              >
                <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.submitText}>Submit Rating</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: 40 },
  emojiSection: { alignItems: 'center', marginBottom: 24, height: 80 },
  emoji: { fontSize: 60 },
  emojiPlaceholder: { fontSize: 60 },
  ratingLabel: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginTop: 8 },
  rateTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a2e', marginBottom: 8, textAlign: 'center' },
  rateDesc: { fontSize: 15, color: '#999', marginBottom: 32 },
  starsRow: { flexDirection: 'row', marginBottom: 40 },
  starBtn: { paddingHorizontal: 8 },
  feedbackSection: { width: '100%' },
  feedbackLabel: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  feedbackInput: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18, fontSize: 15,
    color: '#1a1a2e', height: 120, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
    shadowRadius: 8, elevation: 2, marginBottom: 20,
  },
  submitBtn: { borderRadius: 18, overflow: 'hidden', shadowColor: '#6c63ff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
  submitGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 18,
  },
  submitText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  successContainer: { flex: 1, backgroundColor: '#f8f8fc', alignItems: 'center', justifyContent: 'center' },
  successContent: { alignItems: 'center', paddingHorizontal: 40 },
  successIconBg: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fde8e8',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', marginBottom: 12 },
  successDesc: { fontSize: 16, color: '#888', textAlign: 'center', lineHeight: 24 },
});

export default RateUsScreen;