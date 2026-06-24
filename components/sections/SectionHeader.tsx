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
      <View style={styles.titleRow}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {onViewAll && (
        <Pressable onPress={onViewAll} hitSlop={8} style={styles.viewAllBtn}>
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.headlineSmall,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  viewAllBtn: {
    paddingLeft: spacing.sm,
  },
  viewAll: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '600',
  },
});
