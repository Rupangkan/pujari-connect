/**
 * OTP Verification Screen
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { config } from '@/constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OtpVerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(config.OTP_RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (text: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = text.slice(-1);
    setOtp(newOtp);
    if (text && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      // In dev, any 6-digit OTP works — go to home
      router.replace('/(tabs)');
    }
  };

  const handleResend = () => {
    setCountdown(config.OTP_RESEND_SECONDS);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <LinearGradient colors={['#1A0A00', '#0F0804']} style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      <Animated.View entering={FadeInDown.delay(100)} style={styles.content}>
        <Text style={styles.emoji}>📱</Text>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to{'\n'}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>
        {__DEV__ && <Text style={styles.devHint}>Dev mode: use OTP 123456</Text>}

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={r => { inputs.current[idx] = r; }}
              style={[styles.otpBox, digit && styles.otpBoxFilled, idx === otp.findIndex(d => !d) && styles.otpBoxActive]}
              value={digit}
              onChangeText={t => handleChange(t, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={colors.primary}
            />
          ))}
        </View>

        {/* Verify */}
        <Pressable
          onPress={handleVerify}
          disabled={!isComplete}
          style={({ pressed }) => [
            styles.verifyBtn,
            isComplete && styles.verifyBtnActive,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={[styles.verifyText, isComplete && styles.verifyTextActive]}>
            Verify & Continue
          </Text>
        </Pressable>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the OTP? </Text>
          {canResend ? (
            <Pressable onPress={handleResend}>
              <Text style={styles.resendBtn}>Resend</Text>
            </Pressable>
          ) : (
            <Text style={styles.countdown}>Resend in {countdown}s</Text>
          )}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 56, left: spacing.lg, padding: spacing.sm },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.xxl, alignItems: 'center' },
  emoji: { fontSize: 48, marginBottom: spacing.lg },
  title: { ...typography.displayMedium, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 22 },
  phone: { color: colors.primary, fontWeight: '700' },
  devHint: { ...typography.labelSmall, color: colors.accentYellow, marginBottom: spacing.lg, backgroundColor: 'rgba(255,237,41,0.1)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  otpRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  otpBox: {
    width: 46, height: 56, borderRadius: borderRadius.md,
    backgroundColor: colors.cardBg, borderWidth: 1.5, borderColor: colors.cardBorder,
    ...typography.headlineMedium, color: colors.textPrimary,
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: 'rgba(255,121,44,0.1)' },
  otpBoxActive: { borderColor: colors.primary },
  verifyBtn: {
    width: SCREEN_WIDTH - spacing.xxl * 2,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginBottom: spacing.lg,
  },
  verifyBtnActive: { backgroundColor: colors.success },
  verifyText: { ...typography.button, color: colors.textMuted },
  verifyTextActive: { color: '#fff' },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLabel: { ...typography.bodySmall, color: colors.textMuted },
  resendBtn: { ...typography.labelMedium, color: colors.primary },
  countdown: { ...typography.labelMedium, color: colors.textMuted },
});
