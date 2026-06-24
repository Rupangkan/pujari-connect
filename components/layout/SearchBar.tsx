/**
 * SearchBar + LocationHeader — top-of-home controls.
 * Light theme, vector icons, no emojis.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
}

export function SearchBar({ onPress, placeholder = 'Search for pujas, samagri...' }: SearchBarProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon name="search-outline" size={18} color={colors.textMuted} />
      <Text style={styles.placeholder} numberOfLines={1}>{placeholder}</Text>
    </Pressable>
  );
}

interface LocationHeaderProps {
  location: string;
  onLocationPress?: () => void;
  onProfilePress?: () => void;
}

export function LocationHeader({ location, onLocationPress, onProfilePress }: LocationHeaderProps) {
  return (
    <View style={styles.locationContainer}>
      <Pressable onPress={onLocationPress} style={styles.locationLeft} hitSlop={6}>
        <View style={styles.pin}>
          <Icon name="location-sharp" size={16} color={colors.primary} />
        </View>
        <View style={styles.locationTextWrap}>
          <Text style={styles.locationLabel}>DELIVER TO</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
            <Icon name="chevron-down" size={14} color={colors.textSecondary} />
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={onProfilePress}
        hitSlop={8}
        style={({ pressed }) => [styles.profileButton, pressed && { opacity: 0.7 }]}
      >
        <Icon name="person-circle-outline" size={30} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // SearchBar
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  placeholder: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    flex: 1,
  },

  // LocationHeader
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(242, 112, 10, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: { flex: 1 },
  locationLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...typography.titleSmall,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
