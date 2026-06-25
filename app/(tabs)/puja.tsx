/**
 * PUJA Tab — browse all pujas with category filter (live data).
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/cards/EventCard';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { SearchBar } from '@/components/layout/SearchBar';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujaService } from '@/services/puja.service';
import { pujaToEvent } from '@/utils/mappers';
import { Puja } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - GRID_GAP) / 2;

const CATEGORIES = ['All', 'Home', 'Personal', 'Festival', 'Temple', 'Ancestral'];

export default function PujaScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data, loading, error, reload } = useApi<Puja[]>(
    () => pujaService.getAll().then(r => (r.data as any).data as Puja[]),
    []
  );

  const all = data ?? [];
  const filtered = selectedCategory === 'All'
    ? all
    : all.filter(p => p.category === selectedCategory.toUpperCase());

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Puja Booking</Text>
        <Text style={styles.subtitle}>Choose from our curated rituals</Text>
      </View>
      <SearchBar onPress={() => router.push('/search')} placeholder="Search pujas by name, category..." />

      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.chipContainer}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Chip label={item} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
        )}
      />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
          <SectionHeader title={`${filtered.length} ${selectedCategory !== 'All' ? selectedCategory : 'Pujas'} Available`} />
          {filtered.length === 0 ? (
            <EmptyView icon="flame-outline" title="No pujas found" subtitle="Try a different category." />
          ) : (
            <View style={styles.grid}>
              {filtered.map((puja) => (
                <EventCard
                  key={puja.id}
                  event={pujaToEvent(puja)}
                  width={COLUMN_WIDTH}
                  compact
                  onPress={() => router.push(`/puja/${puja.id}`)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { ...typography.displayMedium, color: colors.textPrimary },
  subtitle: { ...typography.bodyMedium, color: colors.textMuted, marginTop: 4 },
  chipList: { flexGrow: 0 },
  chipContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: GRID_GAP,
  },
});
