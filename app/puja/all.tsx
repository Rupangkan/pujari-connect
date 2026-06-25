/**
 * All Pujas — full listing with category/type/sort filters (live data).
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { EventCard } from '@/components/cards/EventCard';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujaService } from '@/services/puja.service';
import { pujaToEvent } from '@/utils/mappers';
import { Puja } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_W = (SCREEN_WIDTH - spacing.lg * 2 - 12) / 2;

const CATEGORIES = ['All', 'HOME', 'PERSONAL', 'FESTIVAL', 'TEMPLE', 'ANCESTRAL'];
const TYPES = ['All', 'ONLINE', 'OFFLINE', 'BOTH'];
const CATEGORY_LABELS: Record<string, string> = { All: 'All', HOME: 'Home', PERSONAL: 'Personal', FESTIVAL: 'Festival', TEMPLE: 'Temple', ANCESTRAL: 'Ancestral' };
const TYPE_LABELS: Record<string, string> = { All: 'All Types', ONLINE: 'Online', OFFLINE: 'In-Person', BOTH: 'Both' };
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low'];

export default function AllPujasScreen() {
  const { category: initialCategory } = useLocalSearchParams<{ category: string }>();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { data, loading, error, reload } = useApi<Puja[]>(
    () => pujaService.getAll().then(r => (r.data as any).data as Puja[]),
    []
  );

  const filtered = useMemo(() => {
    let list = (data ?? [])
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .filter(p => selectedType === 'All' || p.type === selectedType);
    if (selectedSort === 'Price: Low to High') list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    else if (selectedSort === 'Price: High to Low') list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [data, selectedCategory, selectedType, selectedSort]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>All Pujas</Text>
          <Text style={styles.subtitle}>{filtered.length} rituals available</Text>
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
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.chipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={CATEGORY_LABELS[item]} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
        )}
      />

      <FlatList
        data={TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.typeChipRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <Chip label={TYPE_LABELS[item]} size="sm" selected={selectedType === item} onPress={() => setSelectedType(item)} />
        )}
      />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {filtered.length === 0 ? (
            <EmptyView icon="flame-outline" title="No pujas found" subtitle="Try different filters." />
          ) : (
            <View style={styles.grid}>
              {filtered.map(puja => (
                <EventCard key={puja.id} event={pujaToEvent(puja)} width={CARD_W} compact onPress={() => router.push(`/puja/${puja.id}`)} />
              ))}
            </View>
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
  sortOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg, minWidth: 200 },
  sortOptionActive: { backgroundColor: 'rgba(242,112,10,0.08)' },
  sortOptionText: { ...typography.bodyMedium, color: colors.textSecondary },
  sortOptionTextActive: { color: colors.primary, fontWeight: '600' },
  chipList: { flexGrow: 0 },
  chipRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
  typeChipRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: 12 },
});
