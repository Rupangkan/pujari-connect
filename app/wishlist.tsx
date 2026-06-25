/**
 * Wishlist Screen. Light Ivory & Gold theme.
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { EventCard } from '@/components/cards/EventCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_W = (SCREEN_WIDTH - spacing.lg * 2 - 12) / 2;

const WISHLIST_ITEMS = [
  { id: '1', title: 'Griha Pravesh Puja', dateTime: 'Book Anytime', venue: 'At Your Home', price: '₹5,100', discountText: 'Most Popular' },
  { id: '3', title: 'Lakshmi Puja', dateTime: '20 Sep - 5 Oct', venue: 'Haridwar', price: '₹2,100', discountText: '15% OFF' },
];

export default function WishlistScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>My Wishlist</Text>
      </View>

      <FlatList
        data={WISHLIST_ITEMS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}><Icon name="heart-outline" size={44} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtitle}>Save your favorite pujas to book them later.</Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/puja/all')}>
              <Text style={styles.exploreText}>Explore Pujas</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard event={item} width={CARD_W} compact onPress={() => router.push(`/puja/${item.id}`)} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, paddingTop: spacing.sm },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.massive },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  emptyTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  exploreBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  exploreText: { ...typography.button, color: colors.textOnPrimary },
});
