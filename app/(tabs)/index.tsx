/**
 * FOR YOU Tab — home feed: popular pujas + browse by tradition (live data).
 */
import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, FlatList,
  Dimensions, Pressable, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { EventCard } from '@/components/cards/EventCard';
import { MoodCard } from '@/components/cards/MoodCard';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { LocationHeader, SearchBar } from '@/components/layout/SearchBar';
import { LoadingView, ErrorView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujaService } from '@/services/puja.service';
import { pujaToEvent } from '@/utils/mappers';
import { config } from '@/constants/config';
import { Puja } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.74;
const CARD_MARGIN = 12;

const ETHNICITY_MOODS = [
  { id: '1', title: 'Assamese', emoji: '🌺' },
  { id: '2', title: 'Bengali', emoji: '🌸' },
  { id: '3', title: 'Hindi', emoji: '🪔' },
  { id: '4', title: 'Tamil', emoji: '🕉️' },
  { id: '5', title: 'Telugu', emoji: '🌿' },
  { id: '6', title: 'Kannada', emoji: '⭐' },
];

export default function ForYouScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { data, loading, error, reload } = useApi<Puja[]>(
    () => pujaService.getFeatured().then(r => (r.data as any).data as Puja[]),
    []
  );
  const featured = data ?? [];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN));
    setActiveIndex(index);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
        <LocationHeader location={config.DEFAULT_LOCATION_DETAIL} onProfilePress={() => router.push('/profile')} />
        <SearchBar onPress={() => router.push('/search')} />

        <SectionHeader title="Popular Pujas" onViewAll={() => router.push('/puja/all')} />
        {loading ? (
          <LoadingView style={{ minHeight: 220 }} />
        ) : error ? (
          <ErrorView message={error} onRetry={reload} style={{ minHeight: 220 }} />
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_MARGIN}
              decelerationRate="fast"
              contentContainerStyle={styles.carousel}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <EventCard event={pujaToEvent(item)} width={CARD_WIDTH} onPress={() => router.push(`/puja/${item.id}`)} />
              )}
              ItemSeparatorComponent={() => <View style={{ width: CARD_MARGIN }} />}
            />
            <View style={styles.dotsRow}>
              {featured.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
              ))}
            </View>
          </>
        )}

        <SectionHeader title="Browse by Tradition" onViewAll={() => router.push('/pujari/all')} />
        <FlatList
          data={ETHNICITY_MOODS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodRow}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MoodCard
              title={item.title}
              emoji={item.emoji}
              onPress={() => router.push({ pathname: '/pujari/all', params: { ethnicity: item.title } })}
            />
          )}
        />

        <Pressable style={styles.bannerWrap} onPress={() => router.push('/puja/all')}>
          <LinearGradient colors={colors.gradientAarti} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.bannerIcon}><Icon name="gift" size={24} color={colors.maroon} /></View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>First Booking Free!</Text>
              <Text style={styles.bannerSubtitle}>Free consultation with any pujari</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.maroon} />
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  carousel: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: spacing.sm, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cardBorderLight },
  dotActive: { width: 18, backgroundColor: colors.primary },
  moodRow: { paddingHorizontal: spacing.lg, gap: spacing.lg, paddingBottom: spacing.sm },
  bannerWrap: { marginHorizontal: spacing.lg, marginTop: spacing.md },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg },
  bannerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center' },
  bannerContent: { flex: 1 },
  bannerTitle: { ...typography.titleMedium, color: colors.maroon, fontWeight: '700' },
  bannerSubtitle: { ...typography.bodySmall, color: 'rgba(122,31,43,0.75)' },
});
