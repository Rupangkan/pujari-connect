/**
 * Samagri Cart / Checkout Screen
 */
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { useCartStore } from '@/store/cartStore';

export default function CartScreen() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getDeliveryFee } = useCartStore();
  const total = getTotal();
  const delivery = getDeliveryFee();
  const grandTotal = total + delivery;

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>← Cart</Text>
        </Pressable>
        {items.length > 0 && (
          <Pressable onPress={clearCart}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
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
                <View style={styles.itemEmoji}>
                  <Text style={styles.emojiText}>🪔</Text>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price} / {item.unit}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <Pressable onPress={() => updateQuantity(item.id, item.cartQuantity - 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.qty}>{item.cartQuantity}</Text>
                  <Pressable onPress={() => updateQuantity(item.id, item.cartQuantity + 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={[styles.summaryValue, delivery === 0 && { color: colors.success }]}>
                  {delivery === 0 ? 'FREE 🎉' : `₹${delivery}`}
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

          {/* Checkout button */}
          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>Total</Text>
              <Text style={styles.checkoutPrice}>₹{grandTotal.toLocaleString('en-IN')}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.checkoutBtn, pressed && { opacity: 0.85 }]}
              onPress={() => router.push('/booking/address')}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
            </Pressable>
          </View>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: {},
  backIcon: { ...typography.titleMedium, color: colors.primary },
  clearText: { ...typography.labelMedium, color: colors.error },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.lg },
  emptyTitle: { ...typography.headlineMedium, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted, marginBottom: spacing.xxl },
  browseBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xxxl, paddingVertical: spacing.lg, borderRadius: borderRadius.xl },
  browseBtnText: { ...typography.button, color: '#fff' },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  itemEmoji: { width: 44, height: 44, backgroundColor: colors.surfaceContainerHigh, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  emojiText: { fontSize: 22 },
  itemDetails: { flex: 1 },
  itemName: { ...typography.titleSmall, color: colors.textPrimary },
  itemPrice: { ...typography.bodySmall, color: colors.textMuted },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerHigh, borderRadius: borderRadius.sm, overflow: 'hidden' },
  qtyBtn: { width: 30, height: 30, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qty: { ...typography.titleSmall, color: colors.textPrimary, paddingHorizontal: spacing.md },
  summaryCard: { backgroundColor: colors.cardBg, borderRadius: borderRadius.lg, padding: spacing.lg, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder },
  summaryTitle: { ...typography.titleLarge, color: colors.textPrimary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  summaryValue: { ...typography.bodyMedium, color: colors.textPrimary },
  deliveryHint: { ...typography.labelSmall, color: colors.primary, marginBottom: spacing.sm },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: spacing.md, marginTop: spacing.sm },
  totalLabel: { ...typography.titleMedium, color: colors.textPrimary },
  totalValue: { ...typography.price, color: colors.accentYellow },
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surfaceContainerHighest, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.cardBorder },
  checkoutLabel: { ...typography.labelSmall, color: colors.textMuted },
  checkoutPrice: { ...typography.headlineSmall, color: colors.primary },
  checkoutBtn: { backgroundColor: colors.success, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg },
  checkoutBtnText: { ...typography.button, color: '#fff' },
});
