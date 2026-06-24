/**
 * MoodCard — Circular image card with title (for ethnicity/category browsing)
 * Ported from MyPandit's MoodCard composable
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';

interface MoodCardProps {
  title: string;
  imageUrl?: string;
  emoji?: string;
  onPress?: () => void;
  size?: number;
}

export function MoodCard({ title, imageUrl, emoji, onPress, size = 72 }: MoodCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, { borderRadius: size / 2 }]}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.placeholder, { borderRadius: size / 2 }]}>
            <Text style={styles.emoji}>{emoji || '🕉️'}</Text>
          </View>
        )}
        {/* Glow ring */}
        <View style={[styles.ring, { width: size + 4, height: size + 4, borderRadius: (size + 4) / 2 }]} />
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 88,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  imageContainer: {
    marginBottom: spacing.sm,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.goldLight,
  },
  emoji: {
    fontSize: 28,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 154, 62, 0.40)',
    top: -2,
    left: -2,
  },
  title: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
});
