/**
 * Onboarding / Login — phone or Google sign-in. Light Ivory & Gold theme.
 * Content is scrollable so the terms line is always reachable.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { config } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const valid = phoneNumber.length === config.PHONE_LENGTH;

  const handlePhoneLogin = async () => {
    if (!valid || sending) return;
    setError('');
    setSending(true);
    try {
      await login(phoneNumber); // sends OTP
      router.push({ pathname: '/(auth)/otp-verify', params: { phone: phoneNumber } });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message === 'Network Error'
        ? 'Cannot reach the server. Is the backend running?'
        : 'Could not send OTP. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradientScreen} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.huge, paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(150).duration(700)} style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Icon name="flame" size={38} color={colors.primary} />
            </View>
            <Text style={styles.appName}>{config.APP_NAME}</Text>
            <View style={styles.tagContainer}>
              <View style={styles.tagLine} />
              <Text style={styles.tagText}>{config.APP_TAG}</Text>
              <View style={styles.tagLine} />
            </View>
            <Text style={styles.subtitle}>Book trusted Pujaris for your rituals & festivals</Text>
          </Animated.View>

          {/* Login */}
          <Animated.View entering={FadeInUp.delay(400).duration(700)} style={styles.loginSection}>
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

            <Pressable
              onPress={handlePhoneLogin}
              disabled={!valid || sending}
              style={({ pressed }) => [styles.loginButton, valid && styles.loginButtonActive, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.loginButtonText, valid && styles.loginButtonTextActive]}>
                {sending ? 'Sending OTP...' : 'Continue with Phone'}
              </Text>
            </Pressable>
            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={({ pressed }) => [styles.googleButton, pressed && { backgroundColor: colors.cardBgHover }]}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>Continue with Google</Text>
            </Pressable>

            <Pressable onPress={() => router.replace('/(tabs)')} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now →</Text>
            </Pressable>
          </Animated.View>

          {/* Terms */}
          <Animated.View entering={FadeInUp.delay(700).duration(600)} style={styles.termsSection}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
  },

  // Logo
  logoSection: { alignItems: 'center' },
  logoContainer: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.surface,
    borderWidth: 1.5, borderColor: colors.goldLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4,
  },
  appName: { ...typography.displayLarge, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  tagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  tagLine: { width: 24, height: 1, backgroundColor: colors.gold, opacity: 0.6 },
  tagText: { ...typography.badge, color: colors.goldDark, marginHorizontal: spacing.sm, letterSpacing: 2 },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', maxWidth: 280 },

  // Login
  loginSection: { marginVertical: spacing.xxxl },
  phoneContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.cardBorder, marginBottom: spacing.lg, overflow: 'hidden',
  },
  countryCode: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.lg, borderRightWidth: 1, borderRightColor: colors.cardBorder },
  flag: { fontSize: 18, marginRight: spacing.xs },
  code: { ...typography.titleMedium, color: colors.textPrimary },
  phoneInput: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.lg, ...typography.titleMedium, color: colors.textPrimary, letterSpacing: 1 },
  loginButton: { backgroundColor: colors.surfaceContainerHigh, paddingVertical: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginBottom: spacing.lg },
  loginButtonActive: { backgroundColor: colors.primary },
  loginButtonText: { ...typography.button, color: colors.textMuted },
  loginButtonTextActive: { color: colors.textOnPrimary },
  errorText: { ...typography.bodySmall, color: colors.error, textAlign: 'center', marginTop: -spacing.sm, marginBottom: spacing.md },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorderLight },
  dividerText: { ...typography.labelSmall, color: colors.textMuted, marginHorizontal: spacing.md },

  // Google
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder, paddingVertical: spacing.md + 2, borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  googleIcon: { fontSize: 20, fontWeight: '700', color: '#4285F4', marginRight: spacing.sm },
  googleText: { ...typography.button, color: colors.textPrimary },

  // Skip
  skipButton: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { ...typography.labelMedium, color: colors.primary },

  // Terms
  termsSection: { alignItems: 'center' },
  termsText: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
  termsLink: { color: colors.primary, fontWeight: '600' },
});
