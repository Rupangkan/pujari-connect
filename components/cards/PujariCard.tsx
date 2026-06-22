/**
 * PujariCard — Pujari profile card for carousels
 * Ported from MyPandit's PujariCard composable
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
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
      style={({ pressed }) => [
        styles.container,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with image and info */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {pujari.imageUrl ? (
              <Image
                source={{ uri: pujari.imageUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {pujari.name.charAt(0)}
                </Text>
              </View>
            )}
            {pujari.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{pujari.name}</Text>
            <Text style={styles.specialization} numberOfLines={1}>
              {pujari.specialization}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>{pujari.rating.toFixed(1)}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>📋</Text>
                <Text style={styles.statValue}>{pujari.totalBookings}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>🕐</Text>
                <Text style={styles.statValue}>{pujari.experience}yr</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bio */}
        <Text style={styles.bio} numberOfLines={2}>{pujari.bio}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.rateLabel}>Hourly Rate</Text>
            <Text style={styles.rate}>₹{pujari.hourlyRate.toLocaleString()}</Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onBook?.();
            }}
            style={({ pressed }) => [
              styles.bookButton,
              pressed && styles.bookButtonPressed,
            ]}
          >
            <Text style={styles.bookText}>Book</Text>
          </Pressable>
        </View>

        {/* Ethnicity badge */}
        <View style={styles.ethnicityBadge}>
          <Text style={styles.ethnicityText}>{pujari.ethnicity}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    padding: spacing.md,
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
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceContainerHigh,
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
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginBottom: 2,
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
  statIcon: {
    fontSize: 12,
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
    color: colors.accentYellow,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  bookButtonPressed: {
    opacity: 0.8,
  },
  bookText: {
    ...typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
  ethnicityBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 237, 41, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 237, 41, 0.3)',
  },
  ethnicityText: {
    ...typography.badge,
    color: colors.accentYellow,
  },
});
