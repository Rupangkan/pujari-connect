/**
 * SectionHeader — "Title" with optional "View All →" button
 * Ported from MyPandit's FadingDividerText and ViewAll composables
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
}

export function SectionHeader({ title, onViewAll, viewAllLabel = 'View All' }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onViewAll && (
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>{viewAllLabel} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.headlineSmall,
    color: colors.textPrimary,
  },
  viewAll: {
    ...typography.labelMedium,
    color: colors.primary,
  },
});
