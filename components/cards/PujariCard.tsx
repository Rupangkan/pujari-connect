/**
 * PujariCard — pujari profile card for carousels. Light theme.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { Pujari } from '@/types';

interface PujariCardProps {
  pujari: Pujari;
  onPress?: () => void;
  onBook?: () => void;
  width?: number;
}

export function PujariCard({ pujari, onPress, onBook, width = 280 }: PujariCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { width }, pressed && styles.pressed]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {pujari.imageUrl ? (
            <Image source={{ uri: pujari.imageUrl }} style={styles.avatar} contentFit="cover" transition={300} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{pujari.name.charAt(0)}</Text>
            </View>
          )}
          {pujari.isVerified && (
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark" size={11} color={colors.textOnPrimary} />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{pujari.name}</Text>
          <Text style={styles.specialization} numberOfLines={1}>{pujari.specialization}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon name="star" size={12} color={colors.starFilled} />
              <Text style={styles.statValue}>{pujari.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="albums-outline" size={12} color={colors.textMuted} />
              <Text style={styles.statValue}>{pujari.totalBookings}</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="time-outline" size={12} color={colors.textMuted} />
              <Text style={styles.statValue}>{pujari.experience}yr</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={2}>{pujari.bio}</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.rateLabel}>Hourly Rate</Text>
          <Text style={styles.rate}>₹{pujari.hourlyRate.toLocaleString('en-IN')}</Text>
        </View>
        <Pressable
          onPress={(e) => { e.stopPropagation(); onBook?.(); }}
          style={({ pressed }) => [styles.bookButton, pressed && styles.bookButtonPressed]}
        >
          <Text style={styles.bookText}>Book</Text>
        </Pressable>
      </View>

      {/* Ethnicity badge */}
      <View style={styles.ethnicityBadge}>
        <Text style={styles.ethnicityText}>{pujari.ethnicity}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.985 }],
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.goldLight,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(242, 112, 10, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.headlineMedium,
    color: colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  info: { flex: 1 },
  name: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginBottom: 2,
    marginRight: 64,
  },
  specialization: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  bio: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  rate: {
    ...typography.price,
    color: colors.primary,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  bookButtonPressed: { opacity: 0.85 },
  bookText: {
    ...typography.button,
    color: colors.textOnPrimary,
    fontSize: 14,
  },
  ethnicityBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(201, 154, 62, 0.14)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.hairlineGold,
  },
  ethnicityText: {
    ...typography.badge,
    color: colors.goldDark,
  },
});
