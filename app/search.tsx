/**
 * Search Screen — search across pujas. Light Ivory & Gold theme.
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESULT_W = SCREEN_WIDTH - spacing.lg * 2;

const ALL_PUJAS = [
  { id: '1', title: 'Griha Pravesh Puja', dateTime: 'Book Anytime', venue: 'At Your Home', price: '₹5,100', category: 'HOME', keywords: 'home griha pravesh new house' },
  { id: '2', title: 'Satyanarayan Puja', dateTime: 'Daily', venue: 'Kashi / Online', price: '₹3,500', category: 'PERSONAL', keywords: 'satyanarayan vishnu online kashi' },
  { id: '3', title: 'Lakshmi Puja', dateTime: '20 Sep - 5 Oct', venue: 'Haridwar', price: '₹2,100', category: 'FESTIVAL', keywords: 'lakshmi wealth diwali festival' },
  { id: '4', title: 'Ganesh Puja', dateTime: '1 Sep - 10 Oct', venue: 'Mumbai / Online', price: '₹2,500', category: 'PERSONAL', keywords: 'ganesh obstacle removal vinayaka' },
  { id: '5', title: 'Pitru Shanti Mahapuja', dateTime: '2 Oct - 1 Nov', venue: 'Gaya, Bihar', price: '₹5,693', category: 'ANCESTRAL', keywords: 'pitru ancestors shanti tarpan gaya' },
  { id: '6', title: 'Ganesh Chaturthi Puja', dateTime: '7 Sep 2026', venue: 'Your Home', price: '₹2,500', category: 'HOME', keywords: 'ganesh chaturthi festival celebration' },
  { id: '7', title: 'Navratri Complete Package', dateTime: '3-12 Oct 2026', venue: 'Your Home', price: '₹15,000', category: 'HOME', keywords: 'navratri durga 9 days festival' },
  { id: '8', title: 'Vastu Shanti Puja', dateTime: 'Anytime', venue: 'Your Location', price: '₹7,500', category: 'HOME', keywords: 'vastu shanti harmony office home' },
  { id: '9', title: 'Rudrabhishek', dateTime: 'Every Monday', venue: 'Somnath Temple', price: '₹1,100', category: 'TEMPLE', keywords: 'shiva rudra abhishek temple monday' },
  { id: '10', title: 'Hanuman Chalisa Path', dateTime: 'Every Tuesday', venue: 'Hanuman Temple', price: '₹500', category: 'TEMPLE', keywords: 'hanuman chalisa strength protection tuesday' },
  { id: '11', title: 'Saraswati Puja', dateTime: '14 Feb 2026', venue: 'Kamakhya Temple', price: '₹1,800', category: 'TEMPLE', keywords: 'saraswati knowledge education student kamakhya' },
];

const QUICK_SEARCHES = ['Griha Pravesh', 'Ganesh Puja', 'Navratri', 'Lakshmi Puja', 'Rudrabhishek', 'Vastu Shanti'];
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

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_PUJAS.filter(p =>
      p.title.toLowerCase().includes(q) || p.venue.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) || p.keywords.toLowerCase().includes(q)
    );
  }, [query]);

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
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          ListHeaderComponent={<Text style={styles.resultsCount}>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</Text>}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <View style={styles.noResultsIcon}><Icon name="search-outline" size={40} color={colors.textMuted} /></View>
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsSubtitle}>Try different keywords</Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard event={item} width={RESULT_W} compact onPress={() => { Keyboard.dismiss(); router.push(`/puja/${item.id}`); }} />
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
  noResults: { alignItems: 'center', paddingVertical: spacing.massive },
  noResultsIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  noResultsTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  noResultsSubtitle: { ...typography.bodyMedium, color: colors.textMuted },
});
