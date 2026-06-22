/**
 * AnimatedGradient — Animated background gradient
 * Ported from MyPandit's AnimatedGradientBackground composable
 */

import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AnimatedGradientProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'splash' | 'dark' | 'warm';
}

export function AnimatedGradient({ style, children, variant = 'dark' }: AnimatedGradientProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const gradientColors = {
    splash: [colors.background, '#1A0A00', '#2D1408'] as const,
    dark: [colors.background, colors.surface, colors.surfaceContainer] as const,
    warm: ['#1A0A00', '#2D1408', '#0F0A04'] as const,
  };

  return (
    <LinearGradient
      colors={[...gradientColors[variant]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
