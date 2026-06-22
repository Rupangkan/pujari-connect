/**
 * Onboarding Screen — Login with phone number or Google
 * Ported from MyPandit's OnboardingActivity with animated gradient + flickering stars
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { config } from '@/constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generate random stars for the background
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * SCREEN_WIDTH,
  y: Math.random() * SCREEN_HEIGHT * 0.6,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3000,
  duration: Math.random() * 2000 + 1500,
}));

function FlickeringStars() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {STARS.map((star) => (
        <FlickeringStar key={star.id} star={star} />
      ))}
    </View>
  );
}

function FlickeringStar({ star }: { star: (typeof STARS)[0] }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: star.duration }),
          withTiming(0.2, { duration: star.duration })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: '#FFE4C4',
        },
        style,
      ]}
    />
  );
}

export default function OnboardingScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneLogin = () => {
    if (phoneNumber.length !== config.PHONE_LENGTH) return;
    router.push({
      pathname: '/(auth)/otp-verify',
      params: { phone: phoneNumber },
    });
  };

  const handleGoogleLogin = () => {
    // Skip auth for now — go directly to home
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#1A0A00', '#0F0804', '#0A0602']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <FlickeringStars />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Logo Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🙏</Text>
          </View>
          <Text style={styles.appName}>{config.APP_NAME}</Text>
          <View style={styles.tagContainer}>
            <View style={styles.tagLine} />
            <Text style={styles.tagText}>{config.APP_TAG}</Text>
            <View style={styles.tagLine} />
          </View>
          <Text style={styles.subtitle}>
            Book trusted Pujaris for your rituals & festivals
          </Text>
        </Animated.View>

        {/* Login Section */}
        <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.loginSection}>
          {/* Phone Input */}
          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.code}>{config.COUNTRY_CODE}</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter mobile number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={config.PHONE_LENGTH}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Login Button */}
          <Pressable
            onPress={handlePhoneLogin}
            disabled={phoneNumber.length !== config.PHONE_LENGTH || isLoading}
            style={({ pressed }) => [
              styles.loginButton,
              phoneNumber.length === config.PHONE_LENGTH && styles.loginButtonActive,
              pressed && styles.loginButtonPressed,
            ]}
          >
            <Text style={[
              styles.loginButtonText,
              phoneNumber.length === config.PHONE_LENGTH && styles.loginButtonTextActive,
            ]}>
              Continue with Phone
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Login */}
          <Pressable
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.googleButtonPressed,
            ]}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </Pressable>

          {/* Skip */}
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now →</Text>
          </Pressable>
        </Animated.View>

        {/* Terms */}
        <Animated.View entering={FadeInUp.delay(1000).duration(600)} style={styles.termsSection}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: SCREEN_HEIGHT * 0.12,
    paddingBottom: spacing.xxxl,
  },

  // Logo
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 121, 44, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 121, 44, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    ...typography.displayLarge,
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tagLine: {
    width: 24,
    height: 1,
    backgroundColor: colors.secondary,
    opacity: 0.5,
  },
  tagText: {
    ...typography.badge,
    color: colors.secondary,
    marginHorizontal: spacing.sm,
    letterSpacing: 2,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },

  // Login
  loginSection: {
    paddingHorizontal: spacing.xxl,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
  },
  flag: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  code: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    ...typography.titleMedium,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  loginButton: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loginButtonActive: {
    backgroundColor: colors.primary,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonText: {
    ...typography.button,
    color: colors.textMuted,
  },
  loginButtonTextActive: {
    color: '#FFFFFF',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  dividerText: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
  },

  // Google
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  googleButtonPressed: {
    backgroundColor: colors.cardBgHover,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: spacing.sm,
  },
  googleText: {
    ...typography.button,
    color: colors.textPrimary,
  },

  // Skip
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.labelMedium,
    color: colors.primary,
  },

  // Terms
  termsSection: {
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  termsText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
