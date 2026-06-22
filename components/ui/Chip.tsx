/**
 * Chip — Filter chip component for category/ethnicity selection
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
      <Text style={[
        styles.label,
        size === 'sm' && styles.labelSm,
        selected && styles.selectedLabel,
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
    marginRight: spacing.sm,
  },
  containerSm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  selected: {
    backgroundColor: 'rgba(255, 237, 41, 0.15)',
    borderColor: colors.accentYellow,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  labelSm: {
    ...typography.labelSmall,
  },
  selectedLabel: {
    color: colors.accentYellow,
    fontWeight: '700',
  },
});
