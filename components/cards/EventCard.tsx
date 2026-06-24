/**
 * EventCard — puja card for carousels and grids.
 * Light theme: white surface with a warm golden banner. Does not depend on a
 * remote image (falls back to a gradient banner + icon), so cards never render
 * empty.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { EventCard as EventCardType } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_WIDTH = SCREEN_WIDTH * 0.78;

interface EventCardProps {
  event: EventCardType;
  onPress?: () => void;
  width?: number;
  compact?: boolean;
}

export function EventCard({ event, onPress, width = DEFAULT_WIDTH, compact = false }: EventCardProps) {
  const bannerHeight = compact ? 84 : 104;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { width }, pressed && styles.pressed]}
    >
      {/* Banner */}
      <View style={[styles.banner, { height: bannerHeight }]}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        ) : (
          <LinearGradient colors={colors.gradientAarti} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.bannerIcon}>
              <Icon name="flame" size={compact ? 30 : 38} color="rgba(122, 31, 43, 0.28)" />
            </View>
          </LinearGradient>
        )}
        {event.discountText && (
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>{event.discountText}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>{event.title}</Text>

        <View style={styles.metaRow}>
          <Icon name="calendar-outline" size={13} color={colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>{event.dateTime}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>{event.venue}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{event.price}</Text>
          <View style={styles.bookButton}>
            <Text style={styles.bookText}>Book</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.985 }],
  },
  banner: {
    width: '100%',
    justifyContent: 'center',
  },
  bannerIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    maxWidth: '85%',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.labelSmall,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  titleCompact: {
    ...typography.titleSmall,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  price: {
    ...typography.price,
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 3,
    borderRadius: borderRadius.full,
  },
  bookText: {
    ...typography.labelMedium,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
});
