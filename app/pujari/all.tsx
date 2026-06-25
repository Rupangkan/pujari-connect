/**
 * All Pujaris — full listing with ethnicity + sort filters (live data).
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { PujariCard } from '@/components/cards/PujariCard';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujariService } from '@/services/pujari.service';
import { Pujari } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ETHNICITIES = ['All', 'Assamese', 'Bengali', 'Hindi', 'Tamil', 'Telugu'];
const SORT_OPTIONS = ['Top Rated', 'Most Experienced', 'Price: Low to High', 'Price: High to Low', 'Most Booked'];

export default function AllPujarisScreen() {
  const { ethnicity: initialEthnicity } = useLocalSearchParams<{ ethnicity: string }>();
  const [selectedEthnicity, setSelectedEthnicity] = useState(initialEthnicity || 'All');
  const [selectedSort, setSelectedSort] = useState('Top Rated');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { data, loading, error, reload } = useApi<Pujari[]>(
    () => pujariService.getAll().then(r => (r.data as any).data as Pujari[]),
    []
  );

  const filtered = useMemo(() => {
    let list = (data ?? []).filter(p => selectedEthnicity === 'All' || p.ethnicity === selectedEthnicity);
    if (selectedSort === 'Top Rated') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (selectedSort === 'Most Experienced') list = [...list].sort((a, b) => b.experience - a.experience);
    else if (selectedSort === 'Price: Low to High') list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (selectedSort === 'Price: High to Low') list = [...list].sort((a, b) => b.hourlyRate - a.hourlyRate);
    else if (selectedSort === 'Most Booked') list = [...list].sort((a, b) => b.totalBookings - a.totalBookings);
    return list;
  }, [data, selectedEthnicity, selectedSort]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Find a Pujari</Text>
          <Text style={styles.subtitle}>{filtered.length} pujaris available</Text>
        </View>
        <Pressable onPress={() => setShowSortMenu(s => !s)} style={styles.sortBtn}>
          <Icon name="swap-vertical" size={16} color={colors.textSecondary} />
          <Text style={styles.sortLabel}>Sort</Text>
        </Pressable>
      </View>

      {showSortMenu && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map(opt => (
            <Pressable key={opt} onPress={() => { setSelectedSort(opt); setShowSortMenu(false); }} style={[styles.sortOption, selectedSort === opt && styles.sortOptionActive]}>
              <Text style={[styles.sortOptionText, selectedSort === opt && styles.sortOptionTextActive]}>{opt}</Text>
              {selectedSort === opt && <Icon name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        data={ETHNICITIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={item} selected={selectedEthnicity === item} onPress={() => setSelectedEthnicity(item)} />
        )}
      />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {filtered.length === 0 ? (
            <EmptyView icon="person-outline" title="No pujaris found" subtitle="Try changing the ethnicity filter." />
          ) : (
            filtered.map(pujari => (
              <PujariCard
                key={pujari.id}
                pujari={pujari}
                width={SCREEN_WIDTH - spacing.lg * 2}
                onPress={() => router.push(`/pujari/${pujari.id}`)}
                onBook={() => router.push(`/pujari/${pujari.id}`)}
              />
            ))
          )}
          <View style={{ height: spacing.xxxl }} />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  backBtn: { padding: spacing.xs },
  headerText: { flex: 1 },
  title: { ...typography.headlineLarge, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textMuted },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.cardBorder },
  sortLabel: { ...typography.labelMedium, color: colors.textSecondary, fontWeight: '600' },
  sortMenu: { position: 'absolute', top: 72, right: spacing.lg, zIndex: 100, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.cardBorderLight, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 14, elevation: 12 },
  sortOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg, minWidth: 220 },
  sortOptionActive: { backgroundColor: 'rgba(242,112,10,0.08)' },
  sortOptionText: { ...typography.bodyMedium, color: colors.textSecondary },
  sortOptionTextActive: { color: colors.primary, fontWeight: '600' },
  chipList: { flexGrow: 0 },
  chipRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  scroll: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.md },
});
