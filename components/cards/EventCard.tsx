/**
 * EventCard — Puja event card for carousels and lists
 * Ported from MyPandit's EventCard composable (CardComposables.kt)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { EventCard as EventCardType } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;

interface EventCardProps {
  event: EventCardType;
  onPress?: () => void;
  width?: number;
  compact?: boolean;
}

export function EventCard({ event, onPress, width = CARD_WIDTH, compact = false }: EventCardProps) {
  const cardHeight = compact ? 180 : 220;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { width, height: cardHeight },
        pressed && styles.pressed,
      ]}
    >
      {/* Background Image */}
      {event.imageUrl ? (
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <LinearGradient
          colors={['#2D1408', '#1A0A00', '#0F0A04']}
          style={styles.image}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Discount badge */}
      {event.discountText && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText} numberOfLines={1}>
            {event.discountText}
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.dateTime}>{event.dateTime}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.venue} numberOfLines={1}>{event.venue}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{event.price}</Text>
          <View style={styles.bookButton}>
            <Text style={styles.bookText}>Book Now</Text>
          </View>
        </View>
      </View>
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
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  dot: {
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
    fontSize: 8,
  },
  venue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...typography.price,
    color: colors.accentYellow,
  },
  bookButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  bookText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
