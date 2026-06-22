/**
 * SearchBar — Location-aware search bar for the home screen
 * Ported from MyPandit's HomeActivity search bar
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
}

export function SearchBar({ onPress, placeholder = 'Search for Griha Puja, Samagri...' }: SearchBarProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.placeholder}>{placeholder}</Text>
    </Pressable>
  );
}

/**
 * LocationHeader — Shows current location at top of home screen
 */
interface LocationHeaderProps {
  location: string;
  onLocationPress?: () => void;
  onProfilePress?: () => void;
}

export function LocationHeader({ location, onLocationPress, onProfilePress }: LocationHeaderProps) {
  return (
    <View style={styles.locationContainer}>
      <Pressable onPress={onLocationPress} style={styles.locationLeft}>
        <Text style={styles.locationIcon}>📍</Text>
        <View>
          <Text style={styles.locationLabel}>Location</Text>
          <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        </View>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>
      <Pressable
        onPress={onProfilePress}
        style={({ pressed }) => [
          styles.profileButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.profileIcon}>👤</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // SearchBar
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.sm,
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
    paddingVertical: spacing.md,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  locationLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  locationText: {
    ...typography.titleSmall,
    color: colors.textPrimary,
    maxWidth: 250,
  },
  chevron: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 18,
  },
});
