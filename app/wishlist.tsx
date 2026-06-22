/**
 * Wishlist Screen
 */
import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { EventCard } from '@/components/cards/EventCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_W = (SCREEN_WIDTH - spacing.lg * 2 - 12) / 2;

// Mock wishlist data
const WISHLIST_ITEMS = [
  { id: '1', title: 'Griha Pravesh Puja', dateTime: 'Book Anytime', venue: 'At Your Home', price: '₹5,100', category: 'HOME', type: 'OFFLINE', discountText: 'Most Popular' },
  { id: '3', title: 'Lakshmi Puja', dateTime: '20 Sep - 5 Oct', venue: 'Haridwar', price: '₹2,100', category: 'FESTIVAL', type: 'ONLINE', discountText: '15% OFF Online' },
];

export default function WishlistScreen() {
  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
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
            <Text style={styles.emptyEmoji}>❤️</Text>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtitle}>Save your favorite pujas to book them later.</Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/puja/all')}>
              <Text style={styles.exploreText}>Explore Pujas</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            width={CARD_W}
            compact
            onPress={() => router.push(`/puja/${item.id}`)}
          />
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: { marginRight: spacing.md, padding: spacing.xs },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, paddingTop: spacing.md },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  // Empty State
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.massive * 2 },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.bodyMedium, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  exploreBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md },
  exploreText: { ...typography.button, color: '#fff' },
});
