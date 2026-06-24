/**
 * Chip — filter chip for category / ethnicity selection.
 * Fixed height prevents the horizontal list from stretching chips vertically.
 */

import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export function Chip({ label, selected = false, onPress, size = 'md' }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        size === 'sm' && styles.containerSm,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.label, selected && styles.selectedLabel]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  containerSm: {
    height: 34,
    paddingHorizontal: spacing.md,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  selectedLabel: {
    color: colors.textOnPrimary,
  },
});
