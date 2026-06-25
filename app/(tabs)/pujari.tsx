/**
 * PUJARI Tab — browse and book pujaris (live data).
 */
import React from 'react';
import { View, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { spacing } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { PujariCard } from '@/components/cards/PujariCard';
import { EventCard } from '@/components/cards/EventCard';
import { MoodCard } from '@/components/cards/MoodCard';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { LocationHeader, SearchBar } from '@/components/layout/SearchBar';
import { LoadingView, ErrorView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujariService } from '@/services/pujari.service';
import { pujaService } from '@/services/puja.service';
import { pujaToEvent } from '@/utils/mappers';
import { config } from '@/constants/config';
import { Pujari, Puja } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;

const ETHNICITY_MOODS = [
  { id: '1', title: 'Assamese', emoji: '🌺' },
  { id: '2', title: 'Bengali', emoji: '🌸' },
  { id: '3', title: 'Hindi', emoji: '🪔' },
  { id: '4', title: 'Tamil', emoji: '🕉️' },
  { id: '5', title: 'Telugu', emoji: '🌿' },
];

export default function PujariScreen() {
  const pujaris = useApi<Pujari[]>(() => pujariService.getAll().then(r => (r.data as any).data as Pujari[]), []);
  const pujas = useApi<Puja[]>(() => pujaService.getAll().then(r => (r.data as any).data as Puja[]), []);

  const loading = pujaris.loading || pujas.loading;
  const error = pujaris.error || pujas.error;
  const reload = () => { pujaris.reload(); pujas.reload(); };

  const topPujaris = (pujaris.data ?? []).slice(0, 8);
  const homePujas = (pujas.data ?? []).filter(p => p.category === 'HOME').slice(0, 6);
  const templePujas = (pujas.data ?? []).filter(p => p.category === 'TEMPLE').slice(0, 6);

  return (
    <Screen>
      <LocationHeader location={config.DEFAULT_LOCATION_DETAIL} onProfilePress={() => router.push('/profile')} />
      <SearchBar onPress={() => router.push('/search')} placeholder="Search for Pujari, Pandit..." />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
          <SectionHeader title="Top Pujaris" onViewAll={() => router.push('/pujari/all')} />
          <FlatList
            data={topPujaris}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PujariCard
                pujari={item}
                width={CARD_WIDTH}
                onPress={() => router.push(`/pujari/${item.id}`)}
                onBook={() => router.push(`/pujari/${item.id}`)}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />

          <SectionHeader title="Book by Tradition" onViewAll={() => router.push('/pujari/all')} />
          <FlatList
            data={ETHNICITY_MOODS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodRow}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MoodCard title={item.title} emoji={item.emoji}
                onPress={() => router.push({ pathname: '/pujari/all', params: { ethnicity: item.title } })} />
            )}
          />

          {homePujas.length > 0 && (
            <>
              <SectionHeader title="Pujas at Home" onViewAll={() => router.push({ pathname: '/puja/all', params: { category: 'HOME' } })} />
              <FlatList
                data={homePujas}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <EventCard event={pujaToEvent(item)} width={260} compact onPress={() => router.push(`/puja/${item.id}`)} />
                )}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              />
            </>
          )}

          {templePujas.length > 0 && (
            <>
              <SectionHeader title="Pujas at Temple" onViewAll={() => router.push({ pathname: '/puja/all', params: { category: 'TEMPLE' } })} />
              <FlatList
                data={templePujas}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <EventCard event={pujaToEvent(item)} width={260} compact onPress={() => router.push(`/puja/${item.id}`)} />
                )}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              />
            </>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  carousel: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  moodRow: { paddingHorizontal: spacing.lg, gap: spacing.lg, paddingBottom: spacing.sm },
});
