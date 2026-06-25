/**
 * Wishlist Screen (live data, auth-gated).
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { EventCard } from '@/components/cards/EventCard';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { userService } from '@/services/user.service';
import { pujaToEvent } from '@/utils/mappers';
import { useAuthStore } from '@/store/authStore';
import { Puja } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_W = (SCREEN_WIDTH - spacing.lg * 2 - 12) / 2;

export default function WishlistScreen() {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const { data, loading, error, reload } = useApi<Puja[]>(
    () => isAuth ? userService.getWishlist().then(r => (r.data as any).data as Puja[]) : Promise.resolve([]),
    [isAuth]
  );
  const items = data ?? [];

  return (
    <Screen>
      <ScreenHeader title="My Wishlist" />
      {!isAuth ? (
        <EmptyView icon="heart-outline" title="Sign in to view your wishlist" subtitle="Save favorite pujas and book them later." actionLabel="Sign In" onAction={() => router.replace('/(auth)/onboarding')} />
      ) : loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : items.length === 0 ? (
        <EmptyView icon="heart-outline" title="Your wishlist is empty" subtitle="Save your favorite pujas to book them later." actionLabel="Explore Pujas" onAction={() => router.push('/puja/all')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EventCard event={pujaToEvent(item)} width={CARD_W} compact onPress={() => router.push(`/puja/${item.id}`)} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, paddingTop: spacing.sm },
  row: { justifyContent: 'space-between', marginBottom: 12 },
});
