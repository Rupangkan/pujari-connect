/**
 * OTP Verification Screen — light Ivory & Gold theme.
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { config } from '@/constants/config';
import { useAuthStore } from '@/store/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OtpVerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(config.OTP_RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    setCanResend(true);
  }, [countdown]);

  const handleChange = (text: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = text.slice(-1);
    setOtp(newOtp);
    if (text && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6 || verifying) return;
    setError('');
    setVerifying(true);
    try {
      await verifyOtp(String(phone), code);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setCountdown(config.OTP_RESEND_SECONDS);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputs.current[0]?.focus();
    try { await login(String(phone)); } catch { /* ignore */ }
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <LinearGradient colors={colors.gradientScreen} style={styles.container}>
      <Pressable onPress={() => router.back()} style={[styles.backButton, { top: insets.top + spacing.sm }]} hitSlop={8}>
        <Icon name="arrow-back" size={22} color={colors.textPrimary} />
      </Pressable>

      <Animated.View entering={FadeInDown.delay(100)} style={styles.content}>
        <View style={styles.iconWrap}>
          <Icon name="chatbubble-ellipses-outline" size={34} color={colors.primary} />
        </View>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to{'\n'}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>
        {__DEV__ && <Text style={styles.devHint}>Dev mode: use OTP 123456</Text>}

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

        <Pressable
          onPress={handleVerify}
          disabled={!isComplete || verifying}
          style={({ pressed }) => [styles.verifyBtn, isComplete && styles.verifyBtnActive, pressed && { opacity: 0.85 }]}
        >
          <Text style={[styles.verifyText, isComplete && styles.verifyTextActive]}>
            {verifying ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </Pressable>
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the OTP? </Text>
          {canResend ? (
            <Pressable onPress={handleResend}><Text style={styles.resendBtn}>Resend</Text></Pressable>
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
  backButton: { position: 'absolute', left: spacing.lg, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.xxl, alignItems: 'center' },
  iconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.goldLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.displayMedium, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 22 },
  phone: { color: colors.primary, fontWeight: '700' },
  devHint: { ...typography.labelSmall, color: colors.goldDark, marginBottom: spacing.lg, backgroundColor: 'rgba(201,154,62,0.12)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  otpRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  otpBox: {
    width: 46, height: 56, borderRadius: borderRadius.md,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.cardBorder,
    ...typography.headlineMedium, color: colors.textPrimary,
  },
  otpBoxFilled: { borderColor: colors.primary, backgroundColor: 'rgba(242,112,10,0.06)' },
  otpBoxActive: { borderColor: colors.primary },
  verifyBtn: { width: SCREEN_WIDTH - spacing.xxl * 2, backgroundColor: colors.surfaceContainerHigh, paddingVertical: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', marginBottom: spacing.lg },
  verifyBtnActive: { backgroundColor: colors.primary },
  verifyText: { ...typography.button, color: colors.textMuted },
  verifyTextActive: { color: colors.textOnPrimary },
  errorText: { ...typography.bodySmall, color: colors.error, textAlign: 'center', marginTop: -spacing.sm, marginBottom: spacing.md },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendLabel: { ...typography.bodySmall, color: colors.textMuted },
  resendBtn: { ...typography.labelMedium, color: colors.primary },
  countdown: { ...typography.labelMedium, color: colors.textMuted },
});
