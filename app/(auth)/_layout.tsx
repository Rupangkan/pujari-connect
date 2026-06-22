/**
 * Auth Layout — Wraps auth screens (onboarding, OTP verify)
 */

import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      <Stack.Screen name="otp-verify" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
