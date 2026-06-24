/**
 * SamagriItemCard — product row for the Samagri shop. Light theme, vector icons.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon, type IconName } from '@/components/ui/Icon';
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
      {/* Thumbnail */}
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={300} />
        ) : (
          <Icon name={getCategoryIcon(item.category)} size={26} color={colors.primary} />
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

      {/* Add / Quantity */}
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
            <Pressable onPress={onRemove} style={styles.qtyButton} hitSlop={4}>
              <Icon name="remove" size={16} color={colors.textOnPrimary} />
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable onPress={onAdd} style={styles.qtyButton} hitSlop={4}>
              <Icon name="add" size={16} color={colors.textOnPrimary} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function getCategoryIcon(category: string): IconName {
  const map: Record<string, IconName> = {
    Flowers: 'flower-outline',
    Fruits: 'nutrition-outline',
    Grains: 'leaf-outline',
    Vessels: 'cafe-outline',
    Fragrance: 'flame-outline',
    Powders: 'color-palette-outline',
    Offerings: 'gift-outline',
    Accessories: 'sparkles-outline',
  };
  return map[category] || 'leaf-outline';
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.sm,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginRight: spacing.md,
    backgroundColor: 'rgba(242, 112, 10, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    ...typography.badge,
    color: '#FFFFFF',
    fontSize: 7,
    textAlign: 'center',
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
    color: colors.primary,
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
    borderColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(242, 112, 10, 0.06)',
  },
  addButtonPressed: {
    backgroundColor: 'rgba(242, 112, 10, 0.16)',
  },
  addButtonDisabled: {
    borderColor: colors.textMuted,
    opacity: 0.5,
  },
  addText: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  quantity: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    minWidth: 36,
    textAlign: 'center',
  },
});
