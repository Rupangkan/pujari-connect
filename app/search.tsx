/**
 * Search Screen — search across pujas (live data).
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, Pressable, Keyboard, ScrollView, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Screen } from '@/components/layout/Screen';
import { Icon, type IconName } from '@/components/ui/Icon';
import { EventCard } from '@/components/cards/EventCard';
import { LoadingView, ErrorView, EmptyView } from '@/components/ui/AsyncBoundary';
import { useApi } from '@/hooks/useApi';
import { pujaService } from '@/services/puja.service';
import { pujaToEvent } from '@/utils/mappers';
import { Puja } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESULT_W = SCREEN_WIDTH - spacing.lg * 2;

const QUICK_SEARCHES = ['Griha Pravesh', 'Ganesh', 'Navratri', 'Lakshmi', 'Rudrabhishek', 'Vastu'];
const RECENT_SEARCHES = ['Satyanarayan Puja', 'Pitru Shanti'];
const CATEGORIES: { icon: IconName; label: string; cat: string }[] = [
  { icon: 'home-outline', label: 'Home Pujas', cat: 'HOME' },
  { icon: 'person-outline', label: 'Personal Pujas', cat: 'PERSONAL' },
  { icon: 'sparkles-outline', label: 'Festival Pujas', cat: 'FESTIVAL' },
  { icon: 'business-outline', label: 'Temple Pujas', cat: 'TEMPLE' },
  { icon: 'people-outline', label: 'Ancestral Pujas', cat: 'ANCESTRAL' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { data, loading, error, reload } = useApi<Puja[]>(
    () => pujaService.getAll().then(r => (r.data as any).data as Puja[]),
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (data ?? []).filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [data, query]);

  const showResults = query.trim().length > 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.inputWrapper}>
          <Icon name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search pujas, samagri..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Icon name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {!showResults ? (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.quickSearchRow}>
            {QUICK_SEARCHES.map(s => (
              <Pressable key={s} onPress={() => setQuery(s)} style={styles.quickChip}>
                <Text style={styles.quickChipText}>{s}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent</Text>
          {RECENT_SEARCHES.map(s => (
            <Pressable key={s} onPress={() => setQuery(s)} style={styles.recentRow}>
              <Icon name="time-outline" size={16} color={colors.textMuted} />
              <Text style={styles.recentText}>{s}</Text>
              <Icon name="arrow-forward" size={15} color={colors.textMuted} />
            </Pressable>
          ))}

          <Text style={styles.sectionTitle}>Browse by Category</Text>
          {CATEGORIES.map(cat => (
            <Pressable key={cat.cat} onPress={() => router.push({ pathname: '/puja/all', params: { category: cat.cat } })} style={styles.categoryRow}>
              <View style={styles.categoryIcon}><Icon name={cat.icon} size={18} color={colors.primary} /></View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Icon name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      ) : loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          ListHeaderComponent={<Text style={styles.resultsCount}>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</Text>}
          ListEmptyComponent={<EmptyView icon="search-outline" title="No results found" subtitle="Try different keywords." />}
          renderItem={({ item }) => (
            <EventCard event={pujaToEvent(item)} width={RESULT_W} compact onPress={() => { Keyboard.dismiss(); router.push(`/puja/${item.id}`); }} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.primary, paddingHorizontal: spacing.md, height: 48 },
  input: { flex: 1, ...typography.bodyMedium, color: colors.textPrimary },
  sectionTitle: { ...typography.titleMedium, color: colors.textPrimary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  quickSearchRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm },
  quickChip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  quickChipText: { ...typography.labelMedium, color: colors.textSecondary, fontWeight: '600' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  recentText: { ...typography.bodyMedium, color: colors.textSecondary, flex: 1 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  categoryIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  resultsList: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxxl },
  resultsCount: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.md },
});
