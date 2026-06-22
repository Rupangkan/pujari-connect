/**
 * SamagriItemCard — Product card for the Samagri shop tab
 * Ported from MyPandit's SamagriScreen items
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { SamagriItem } from '@/types';

interface SamagriItemCardProps {
  item: SamagriItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function SamagriItemCard({ item, quantity, onAdd, onRemove }: SamagriItemCardProps) {
  return (
    <View style={styles.container}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>
              {getCategoryEmoji(item.category)}
            </Text>
          </View>
        )}
        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.unit}>/{item.unit}</Text>
        </View>
      </View>

      {/* Add/Remove */}
      <View style={styles.actionContainer}>
        {quantity === 0 ? (
          <Pressable
            onPress={onAdd}
            disabled={!item.inStock}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
              !item.inStock && styles.addButtonDisabled,
            ]}
          >
            <Text style={styles.addText}>ADD</Text>
          </Pressable>
        ) : (
          <View style={styles.quantityControl}>
            <Pressable onPress={onRemove} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>−</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable onPress={onAdd} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    Flowers: '🌸',
    Fruits: '🍌',
    Grains: '🌾',
    Vessels: '🏺',
    Fragrance: '🪔',
    Powders: '🟡',
    Offerings: '🍯',
    Accessories: '📿',
  };
  return emojis[category] || '🕉️';
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.sm,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 28,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    ...typography.badge,
    color: colors.error,
    fontSize: 8,
  },
  details: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.titleSmall,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...typography.titleMedium,
    color: colors.accentYellow,
  },
  unit: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  actionContainer: {
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  addButtonPressed: {
    backgroundColor: 'rgba(6, 193, 103, 0.15)',
  },
  addButtonDisabled: {
    borderColor: colors.textMuted,
    opacity: 0.5,
  },
  addText: {
    ...typography.labelMedium,
    color: colors.success,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  qtyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  quantity: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    minWidth: 32,
    textAlign: 'center',
  },
});
