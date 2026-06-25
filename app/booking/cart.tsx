/**
 * Samagri Cart / Checkout Screen. Light Ivory & Gold theme.
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useCartStore } from '@/store/cartStore';

const CATEGORY_ICON: Record<string, IconName> = {
  Flowers: 'flower-outline', Fruits: 'nutrition-outline', Grains: 'leaf-outline',
  Vessels: 'cafe-outline', Fragrance: 'flame-outline', Powders: 'color-palette-outline',
  Offerings: 'gift-outline', Accessories: 'sparkles-outline',
};

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, clearCart, getTotal, getDeliveryFee } = useCartStore();
  const total = getTotal();
  const delivery = getDeliveryFee();
  const grandTotal = total + delivery;

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Cart</Text>
        {items.length > 0 ? (
          <Pressable onPress={clearCart} hitSlop={8}><Text style={styles.clearText}>Clear</Text></Pressable>
        ) : <View style={styles.iconBtn} />}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Icon name="basket-outline" size={44} color={colors.primary} /></View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add samagri items to get started</Text>
          <Pressable onPress={() => router.back()} style={styles.browseBtn}>
            <Text style={styles.browseBtnText}>Browse Samagri</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemIcon}>
                  <Icon name={CATEGORY_ICON[item.category] || 'leaf-outline'} size={22} color={colors.primary} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price} / {item.unit}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <Pressable onPress={() => updateQuantity(item.id, item.cartQuantity - 1)} style={styles.qtyBtn} hitSlop={4}>
                    <Icon name="remove" size={16} color={colors.textOnPrimary} />
                  </Pressable>
                  <Text style={styles.qty}>{item.cartQuantity}</Text>
                  <Pressable onPress={() => updateQuantity(item.id, item.cartQuantity + 1)} style={styles.qtyBtn} hitSlop={4}>
                    <Icon name="add" size={16} color={colors.textOnPrimary} />
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Order summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={[styles.summaryValue, delivery === 0 && { color: colors.success }]}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </Text>
              </View>
              {delivery > 0 && (
                <Text style={styles.deliveryHint}>Add ₹{500 - total} more for free delivery</Text>
              )}
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
              </View>
            </View>
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Checkout bar */}
          <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + spacing.sm }]}>
            <View>
              <Text style={styles.checkoutLabel}>Total</Text>
              <Text style={styles.checkoutPrice}>₹{grandTotal.toLocaleString('en-IN')}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.checkoutBtn, pressed && { opacity: 0.85 }]}
              onPress={() => router.push('/booking/address')}
            >
              <Text style={styles.checkoutBtnText}>Checkout</Text>
              <Icon name="arrow-forward" size={16} color={colors.textOnPrimary} />
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  iconBtn: { width: 44, height: 38, justifyContent: 'center' },
  headerTitle: { ...typography.headlineSmall, color: colors.textPrimary },
  clearText: { ...typography.labelMedium, color: colors.error, fontWeight: '600', textAlign: 'right', width: 44 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  emptyTitle: { ...typography.headlineMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted, marginBottom: spacing.xxl, textAlign: 'center' },
  browseBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xxxl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  browseBtnText: { ...typography.button, color: colors.textOnPrimary },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  itemIcon: { width: 46, height: 46, backgroundColor: 'rgba(242,112,10,0.08)', borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  itemDetails: { flex: 1, marginRight: spacing.sm },
  itemName: { ...typography.titleSmall, color: colors.textPrimary },
  itemPrice: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  qtyBtn: { width: 30, height: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  qty: { ...typography.titleSmall, color: colors.textPrimary, paddingHorizontal: spacing.md, minWidth: 34, textAlign: 'center' },
  summaryCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder },
  summaryTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  summaryValue: { ...typography.bodyMedium, color: colors.textPrimary, fontWeight: '600' },
  deliveryHint: { ...typography.labelSmall, color: colors.primary, marginBottom: spacing.sm },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: spacing.md, marginTop: spacing.sm },
  totalLabel: { ...typography.titleMedium, color: colors.textPrimary },
  totalValue: { ...typography.price, color: colors.primary },
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, paddingTop: spacing.md, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.cardBorderLight, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  checkoutLabel: { ...typography.labelSmall, color: colors.textMuted },
  checkoutPrice: { ...typography.headlineSmall, color: colors.primary },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.success, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  checkoutBtnText: { ...typography.button, color: colors.textOnPrimary },
});
