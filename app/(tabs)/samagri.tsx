/**
 * SAMAGRI Tab — browse and shop puja samagri items (live data).
 *
 * NOTE: The samagri flow is temporarily hidden from the app (see the tab
 * layout, which sets `href: null`). This screen and the cart are kept intact
 * so the feature can be re-enabled later without rebuilding it.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { SamagriItemCard } from '@/components/cards/SamagriItemCard';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { samagriService } from '@/services/samagri.service';
import { useCartStore } from '@/store/cartStore';
import { SamagriItem } from '@/types';

const CATEGORIES = ['All', 'Flowers', 'Fruits', 'Grains', 'Vessels', 'Fragrance', 'Powders', 'Offerings', 'Accessories'];

export default function SamagriScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { items, addItem, removeItem, getTotal, getItemCount, getDeliveryFee } = useCartStore();

  const { data, loading, error, reload } = useApi<SamagriItem[]>(
    () => samagriService.getAll().then(r => (r.data as any).data as SamagriItem[]),
    []
  );

  const allItems = data ?? [];
  const filtered = selectedCategory === 'All' ? allItems : allItems.filter(i => i.category === selectedCategory);
  const itemCount = getItemCount();
  const total = getTotal();
  const delivery = getDeliveryFee();

  const getQuantity = (id: string) => items.find(ci => ci.id === id)?.cartQuantity ?? 0;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Puja Samagri</Text>
          <Text style={styles.subtitle}>Delivered to your doorstep</Text>
        </View>
        {itemCount > 0 && (
          <Pressable onPress={() => router.push('/booking/cart')} style={styles.cartBtn} hitSlop={8}>
            <Icon name="basket-outline" size={26} color={colors.textPrimary} />
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{itemCount}</Text></View>
          </Pressable>
        )}
      </View>

      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={item} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
        )}
      />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyView icon="leaf-outline" title="No items found" subtitle="Try a different category." />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {filtered.map(item => (
            <SamagriItemCard
              key={item.id}
              item={item}
              quantity={getQuantity(item.id)}
              onAdd={() => addItem(item)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
          <View style={{ height: itemCount > 0 ? 96 : spacing.xxxl }} />
        </ScrollView>
      )}

      {itemCount > 0 && (
        <View style={styles.cartBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cartBarItems}>
              {itemCount} items • {delivery === 0 ? 'Free delivery' : `+₹${delivery} delivery`}
            </Text>
            <Text style={styles.cartBarTotal}>₹{(total + delivery).toLocaleString('en-IN')}</Text>
          </View>
          <Pressable onPress={() => router.push('/booking/cart')} style={styles.viewCartBtn}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Icon name="arrow-forward" size={16} color={colors.textOnPrimary} />
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  title: { ...typography.displayMedium, color: colors.textPrimary },
  subtitle: { ...typography.bodyMedium, color: colors.textMuted, marginTop: 4 },
  cartBtn: { padding: spacing.sm },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { ...typography.badge, color: '#fff', fontSize: 9 },
  chipList: { flexGrow: 0 },
  chipRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  cartBar: {
    position: 'absolute', bottom: spacing.lg, left: spacing.lg, right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorderLight,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 12,
  },
  cartBarItems: { ...typography.bodySmall, color: colors.textMuted },
  cartBarTotal: { ...typography.titleLarge, color: colors.textPrimary },
  viewCartBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: borderRadius.full,
  },
  viewCartText: { ...typography.button, color: colors.textOnPrimary, fontSize: 14 },
});
