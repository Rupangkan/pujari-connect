/**
 * Search Screen — Full-text search across pujas and pujaris
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, Pressable,
  Keyboard, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { EventCard } from '@/components/cards/EventCard';

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

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_PUJAS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.keywords.toLowerCase().includes(q)
    );
  }, [query]);

  const showResults = query.trim().length > 0;

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.container}>
      {/* Search bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search pujas, pujaris, samagri..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Text style={styles.clearBtn}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {!showResults ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Quick searches */}
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.quickSearchRow}>
            {QUICK_SEARCHES.map(s => (
              <Pressable key={s} onPress={() => setQuery(s)} style={styles.quickChip}>
                <Text style={styles.quickChipText}>{s}</Text>
              </Pressable>
            ))}
          </View>

          {/* Recent */}
          <Text style={styles.sectionTitle}>Recent</Text>
          {RECENT_SEARCHES.map(s => (
            <Pressable key={s} onPress={() => setQuery(s)} style={styles.recentRow}>
              <Text style={styles.recentIcon}>🕐</Text>
              <Text style={styles.recentText}>{s}</Text>
              <Text style={styles.recentArrow}>→</Text>
            </Pressable>
          ))}

          {/* Browse categories */}
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          {[
            { icon: '🏠', label: 'Home Pujas', cat: 'HOME' },
            { icon: '🙏', label: 'Personal Pujas', cat: 'PERSONAL' },
            { icon: '🎉', label: 'Festival Pujas', cat: 'FESTIVAL' },
            { icon: '⛪', label: 'Temple Pujas', cat: 'TEMPLE' },
            { icon: '👴', label: 'Ancestral Pujas', cat: 'ANCESTRAL' },
          ].map(cat => (
            <Pressable
              key={cat.cat}
              onPress={() => router.push({ pathname: '/puja/all', params: { category: cat.cat } })}
              style={styles.categoryRow}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <Text style={styles.categoryArrow}>›</Text>
            </Pressable>
          ))}
          <View style={{ height: 80 }} />
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <Text style={styles.noResultsTitle}>No results found</Text>
              <Text style={styles.noResultsSubtitle}>Try different keywords</Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard
              event={item}
              width={styles.resultCard.width}
              compact
              onPress={() => { Keyboard.dismiss(); router.push(`/puja/${item.id}`); }}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.xl + 24, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  backBtn: { marginRight: spacing.sm },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBg, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.primary, paddingHorizontal: spacing.md, height: 48 },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  input: { flex: 1, ...typography.bodyMedium, color: colors.textPrimary },
  clearBtn: { color: colors.textMuted, fontSize: 16, padding: spacing.xs },
  sectionTitle: { ...typography.titleMedium, color: colors.textPrimary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  quickSearchRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm },
  quickChip: { backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: borderRadius.full },
  quickChipText: { ...typography.labelMedium, color: colors.textSecondary },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  recentIcon: { fontSize: 16, marginRight: spacing.md, opacity: 0.7 },
  recentText: { ...typography.bodyMedium, color: colors.textSecondary, flex: 1 },
  recentArrow: { color: colors.textMuted, fontSize: 16 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  categoryIcon: { fontSize: 20, marginRight: spacing.md },
  categoryLabel: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  categoryArrow: { fontSize: 22, color: colors.textMuted },
  resultsList: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  resultsCount: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.md },
  resultCard: { width: 'auto' as any },
  noResults: { alignItems: 'center', paddingVertical: spacing.massive },
  noResultsEmoji: { fontSize: 48, marginBottom: spacing.md },
  noResultsTitle: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm },
  noResultsSubtitle: { ...typography.bodyMedium, color: colors.textMuted },
});
